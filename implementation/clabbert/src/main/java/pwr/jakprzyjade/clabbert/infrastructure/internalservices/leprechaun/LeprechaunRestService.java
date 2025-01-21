/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.internalservices.leprechaun;

import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.lepreachaun.LeprechaunService;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.lepreachaun.dtos.RouteIdResponseDto;
import reactor.core.publisher.Mono;

@Service
public class LeprechaunRestService implements LeprechaunService {
    private static final String GET_ROUTE_URI = "/vehicles/{vehicleSideNumber}/route";
    private static final String HEALTH_URI = "/health";

    private final WebClient webClient;

    public LeprechaunRestService(
            WebClient.Builder webClientBuilder,
            @Value(value = "${clabbert.internal-services.leprechaun}") String leprechaunIpString) {

        final var version = getClass().getPackage().getImplementationVersion();

        this.webClient =
                webClientBuilder
                        .baseUrl("http://" + leprechaunIpString + "/int/v1")
                        .defaultHeader("user-agent", "Clabbert/" + version)
                        .build();
    }

    @Override
    public RouteIdResponseDto getRouteIdFromVehicleSideNumber(
            String vehicleSideNumber, UUID requestId) {

        return webClient
                .get()
                .uri(GET_ROUTE_URI, vehicleSideNumber)
                .header("jp-request-id", requestId.toString())
                .retrieve()
                .bodyToMono(RouteIdResponseDto.class)
                .block();
    }

    @Override
    public HttpStatusCode checkHealth() {
        return webClient
                .get()
                .uri(HEALTH_URI)
                .exchangeToMono(response -> Mono.just(response.statusCode()))
                .block();
    }
}
