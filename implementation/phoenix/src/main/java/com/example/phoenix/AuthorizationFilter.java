package com.example.phoenix;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.reactive.ClientHttpConnector;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class AuthorizationFilter extends AbstractGatewayFilterFactory<AuthorizationFilter.Config> {

    private final WebClient webClient;

    public AuthorizationFilter(@Value("${FEATHER_SERVICE_HOST}") String featherHost,
                               @Value("${FEATHER_SERVICE_PORT}") String featherPort) {
        super(Config.class);

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
            String authorizationHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return Mono.error(new RuntimeException("Missing or invalid Authorization header"));
            }

            String token = authorizationHeader.substring(7); // Usuń prefiks "Bearer "

            // Przygotuj ciało żądania jako JSON
            Map<String, String> requestBody = Map.of("accessToken", token);

            System.out.println(requestBody);

            // Wyślij POST z ciałem JSON
            return webClient.post()
                    .uri("/int/v1/verify")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(AuthResponse.class)
                    .flatMap(authResponse -> {
                        // Dodaj nowe nagłówki na podstawie odpowiedzi
                        ServerWebExchange modifiedExchange = exchange.mutate()
                                .request(r -> r.headers(headers -> {
                                    headers.add("jp-user-id", authResponse.getUserId());
                                    headers.add("jp-user-role", authResponse.getUserRole());
                                }))
                                .build();
                        return chain.filter(modifiedExchange);
                    })
                    .onErrorResume(e -> Mono.error(new RuntimeException("Authorization failed", e)));
        };
    }

    public static class Config {
    }

    public static class AuthResponse {
        private String userId;
        private String userRole;

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUserRole() {
            return userRole;
        }

        public void setUserRole(String userRole) {
            this.userRole = userRole;
        }
    }
}
