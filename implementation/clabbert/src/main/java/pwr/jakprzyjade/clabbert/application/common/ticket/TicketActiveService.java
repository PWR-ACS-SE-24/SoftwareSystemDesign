/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.common.ticket;

import java.time.Clock;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.lepreachaun.LeprechaunService;
import pwr.jakprzyjade.clabbert.domain.entities.LongTermOffer;
import pwr.jakprzyjade.clabbert.domain.entities.SingleFareOffer;
import pwr.jakprzyjade.clabbert.domain.entities.Ticket;
import pwr.jakprzyjade.clabbert.domain.entities.TimeLimitedOffer;

@Service
@RequiredArgsConstructor
public class TicketActiveService {
    private final Clock clock;
    private final LeprechaunService leprechaunService;

    public boolean isActive(Ticket ticket, UUID requestId) {
        return switch (ticket.getOffer()) {
            case SingleFareOffer offer -> isActive(requestId, ticket);
            case LongTermOffer offer -> isActive(offer, ticket);
            case TimeLimitedOffer offer -> isActive(offer, ticket);
            default -> throw new IllegalArgumentException("That should not happen");
        };
    }

    private boolean isActive(UUID requestId, Ticket ticket) {
        var currentRouteId =
                leprechaunService
                        .getRouteIdFromVehicleSideNumber(
                                ticket.getValidation().getVehicleSideNumber(), requestId)
                        .getId();
        return ticket.getValidation().getRouteId().equals(UUID.fromString(currentRouteId));
    }

    private boolean isActive(LongTermOffer offer, Ticket ticket) {
        var expirationTime =
                ticket.getValidation().getTime().plus(offer.getIntervalInDays(), ChronoUnit.DAYS);
        return clock.instant().isBefore(expirationTime);
    }

    private boolean isActive(TimeLimitedOffer offer, Ticket ticket) {
        var expirationTime = ticket.getValidation().getTime().plus(offer.getDuration());
        return clock.instant().isBefore(expirationTime);
    }
}
