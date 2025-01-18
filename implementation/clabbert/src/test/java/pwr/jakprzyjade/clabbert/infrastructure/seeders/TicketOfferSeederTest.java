/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.seeders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketOfferRepository;
import pwr.jakprzyjade.clabbert.domain.entities.LongTermOffer;
import pwr.jakprzyjade.clabbert.domain.entities.SingleFareOffer;
import pwr.jakprzyjade.clabbert.domain.entities.TimeLimitedOffer;

@ExtendWith(MockitoExtension.class)
public class TicketOfferSeederTest {
    @Mock TicketOfferRepository ticketOfferRepository;

    @InjectMocks TicketOfferSeeder sut;

    @Test
    void ticketOfferSeederShouldSeedIfDatabaseIsEmpty() {
        // given

        // when
        when(ticketOfferRepository.count()).thenReturn(0L);
        sut.seedIfDbEmpty();

        // then
        verify(ticketOfferRepository, times(2)).save(any(SingleFareOffer.class));
        verify(ticketOfferRepository, times(8)).save(any(TimeLimitedOffer.class));
        verify(ticketOfferRepository, times(20)).save(any(LongTermOffer.class));
    }

    @Test
    void ticketOfferSeederShouldNotSeedIfDatabaseIsNotEmpty() {
        // given

        // when
        when(ticketOfferRepository.count()).thenReturn(1L);
        sut.seedIfDbEmpty();

        // then
        verify(ticketOfferRepository, never()).save(any(SingleFareOffer.class));
        verify(ticketOfferRepository, never()).save(any(TimeLimitedOffer.class));
        verify(ticketOfferRepository, never()).save(any(LongTermOffer.class));
    }
}
