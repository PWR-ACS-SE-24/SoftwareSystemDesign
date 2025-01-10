/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import pwr.jakprzyjade.clabbert.infrastructure.seeders.DataSeeder;

@SpringBootApplication
@RequiredArgsConstructor
public class ClabbertApplication {

    @Value(value = "${clabbert.seeder}")
    private boolean enableDataSeeder;

    private final DataSeeder dataSeeder;

    public static void main(String[] args) {
        SpringApplication.run(ClabbertApplication.class, args);
    }

    @PostConstruct
    public void seedData() {
        if (enableDataSeeder) {
            dataSeeder.seed();
        }
    }
}
