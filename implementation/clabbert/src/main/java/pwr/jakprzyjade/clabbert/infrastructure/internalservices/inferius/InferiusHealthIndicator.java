/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.internalservices.inferius;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.inferius.InferiusService;

@Component
@RequiredArgsConstructor
public class InferiusHealthIndicator implements HealthIndicator {
    private final InferiusService inferiusService;

    @Override
    public Health health() {
        return inferiusService.checkHealth().is2xxSuccessful()
                ? Health.up().build()
                : Health.down().build();
    }
}
