/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.seeders;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class DataSeederTest {
    @Mock private TicketOfferSeeder ticketOfferSeeder;

    @InjectMocks private DataSeeder sut;

    @Test
    void dataSeederShouldInvokeSeeders() {
        // given

        // when
        doNothing().when(ticketOfferSeeder).seedIfDbEmpty();
        sut.seed();

        // then
        verify(ticketOfferSeeder, times(1)).seedIfDbEmpty();
    }
}
