/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.internalservices.leprechaun;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.lepreachaun.LeprechaunService;

@Component
@RequiredArgsConstructor
public class LeprechaunHealthIndicator implements HealthIndicator {
    private final LeprechaunService leprechaunService;

    @Override
    public Health health() {
        return leprechaunService.checkHealth().is2xxSuccessful()
                ? Health.up().build()
                : Health.down().build();
    }
}
