/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.abstractions.internalservices.inferius;

import java.util.UUID;
import org.springframework.http.HttpStatusCode;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.inferius.dtos.ChargeRequestDto;

public interface InferiusService {
    HttpStatusCode charge(ChargeRequestDto request, UUID requestId);

    HttpStatusCode checkHealth();
}
