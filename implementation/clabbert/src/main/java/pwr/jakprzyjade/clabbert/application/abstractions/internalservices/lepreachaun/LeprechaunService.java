/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.abstractions.internalservices.lepreachaun;

import java.util.UUID;
import org.springframework.http.HttpStatusCode;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.lepreachaun.dtos.RouteIdResponseDto;

public interface LeprechaunService {
    RouteIdResponseDto getRouteIdFromVehicleSideNumber(String vehicleSideNumber, UUID requestId);

    HttpStatusCode checkHealth();
}
