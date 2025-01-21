/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.internalservices.inferius;

import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.inferius.InferiusService;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.inferius.dtos.ChargeRequestDto;
import reactor.core.publisher.Mono;

@Service
public class InferiusRestService implements InferiusService {
    private static final String CHARGE_URI = "/charge";
    private static final String HEALTH_URI = "/health";

    private final WebClient webClient;

    public InferiusRestService(
            WebClient.Builder webClientBuilder,
            @Value(value = "${clabbert.internal-services.inferius}") String inferiusIpString) {

        final var version = getClass().getPackage().getImplementationVersion();

        this.webClient =
                webClientBuilder
                        .baseUrl("http://" + inferiusIpString + "/int/v1")
                        .defaultHeader("user-agent", "Clabbert/" + version)
                        .build();
    }

    @Override
    public HttpStatusCode checkHealth() {
        return webClient
                .get()
                .uri(HEALTH_URI)
                .exchangeToMono(response -> Mono.just(response.statusCode()))
                .block();
    }

    @Override
    public HttpStatusCode charge(ChargeRequestDto request, UUID requestId) {
        return webClient
                .post()
                .uri(CHARGE_URI)
                .header("jp-request-id", requestId.toString())
                .body(Mono.just(request), ChargeRequestDto.class)
                .exchangeToMono(response -> Mono.just(response.statusCode()))
                .block();
    }
}
