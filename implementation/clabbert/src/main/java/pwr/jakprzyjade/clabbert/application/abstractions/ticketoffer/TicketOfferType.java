/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.abstractions.ticketoffer;

import pwr.jakprzyjade.clabbert.domain.entities.LongTermOffer;
import pwr.jakprzyjade.clabbert.domain.entities.SingleFareOffer;
import pwr.jakprzyjade.clabbert.domain.entities.TicketOffer;
import pwr.jakprzyjade.clabbert.domain.entities.TimeLimitedOffer;

public enum TicketOfferType {
    SINGLE_FARE,
    LONG_TERM,
    TIME_LIMITED;

    public static TicketOfferType fromOffer(TicketOffer offer) {
        return switch (offer) {
            case SingleFareOffer o -> TicketOfferType.SINGLE_FARE;
            case LongTermOffer o -> TicketOfferType.LONG_TERM;
            case TimeLimitedOffer o -> TicketOfferType.TIME_LIMITED;
            default -> throw new IllegalArgumentException("That should not happen");
        };
    }
}
