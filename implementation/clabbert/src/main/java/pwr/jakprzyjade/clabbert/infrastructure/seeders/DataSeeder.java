/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.seeders;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder {
    private final TicketOfferSeeder ticketOfferSeeder;

    public void seed() {
        ticketOfferSeeder.seedIfDbEmpty();
    }
}
