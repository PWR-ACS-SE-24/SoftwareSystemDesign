package com.example.phoenix;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.reactive.ClientHttpConnector;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class AuthorizationFilter extends AbstractGatewayFilterFactory<AuthorizationFilter.Config> {

    private static final int AUTHORIZATION_HEADER_LENGTH = "Bearer ".length();
    private final WebClient webClient;
    private final String phoenixVersion;

    public AuthorizationFilter(@Value("${FEATHER_SERVICE_HOST}") String featherHost,
                               @Value("${FEATHER_SERVICE_PORT}") String featherPort,
                               @Value("${phoenix.version}") String phoenixVersion) {
        super(Config.class);
        this.phoenixVersion = phoenixVersion;

        String featherBaseUrl = String.format("http://%s:%s", featherHost, featherPort);

        ClientHttpConnector connector = new ReactorClientHttpConnector();
        this.webClient = WebClient.builder()
                .clientConnector(connector)
                .baseUrl(featherBaseUrl)
                .build();
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            HttpHeaders requestHeaders = exchange.getRequest().getHeaders();

            ServerWebExchange cleanedExchange = exchange.mutate()
                    .request(r -> r.headers(headers -> {
                        headers.remove("jp-user-id");
                        headers.remove("jp-user-role");
                    }))
                    .build();

            String authorizationHeader = requestHeaders.getFirst(HttpHeaders.AUTHORIZATION);

            if (authorizationHeader == null) {
                cleanedExchange = cleanedExchange.mutate()
                        .request(r -> r.headers(headers -> {
                            headers.add("jp-user-id", "00000000-0000-0000-0000-000000000000");
                            headers.add("jp-user-role", "guest");
                        }))
                        .build();
                return chain.filter(cleanedExchange);
            }

            if (!authorizationHeader.startsWith("Bearer ")) {
                return handleError(exchange, AppError.builder()
                        .code(400)
                        .kind("INVALID_AUTH")
                        .messageEn("Invalid Authorization header")
                        .messagePl("Nieprawidłowy nagłówek autoryzacji")
                        .build());
            }

            String token = authorizationHeader.substring(AUTHORIZATION_HEADER_LENGTH);
            Map<String, String> requestBody = Map.of("accessToken", token);

            ServerWebExchange finalCleanedExchange = cleanedExchange;
            return webClient.post()
                    .uri("/int/v1/verify")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(AuthResponse.class)
                    .flatMap(authResponse -> {
                        ServerWebExchange modifiedExchange = finalCleanedExchange.mutate()
                                .request(r -> r.headers(headers -> {
                                    headers.add("jp-user-id", authResponse.getUserId());
                                    headers.add("jp-user-role", authResponse.getUserRole());
                                }))
                                .build();

                        return chain.filter(modifiedExchange).doOnSuccess(aVoid -> {
                            ServerHttpResponse response = modifiedExchange.getResponse();
                            response.getHeaders().set("user-agent", "Phoenix/" + phoenixVersion);
                        });
                    })
                    .onErrorResume(e -> handleError(exchange, new AppError(401, "AUTH_FAILED", "Authorization failed", "Autoryzacja nieudana")));
        };
    }

    private Mono<Void> handleError(ServerWebExchange exchange, AppError error) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(org.springframework.http.HttpStatus.valueOf(error.getCode()));
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, "application/json");
        return response.writeWith(Mono.just(response.bufferFactory()
                .wrap(("{\"code\":" + error.getCode() + ",\"kind\":\"" + error.getKind() +
                        "\",\"messageEn\":\"" + error.getMessageEn() + "\",\"messagePl\":\"" + error.getMessagePl() + "\"}").getBytes())));
    }

    public static class Config {
    }

    @Data
    public static class AuthResponse {
        private String userId;
        private String userRole;
    }
}
