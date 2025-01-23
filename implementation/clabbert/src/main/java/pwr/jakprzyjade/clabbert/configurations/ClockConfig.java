/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.configurations;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClockConfig {

    @Bean
    Clock clock() {
        return Clock.systemDefaultZone();
    }
}
