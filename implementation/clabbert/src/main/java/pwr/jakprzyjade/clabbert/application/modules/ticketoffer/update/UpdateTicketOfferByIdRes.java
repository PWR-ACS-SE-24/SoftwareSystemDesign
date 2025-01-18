/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.update;

import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.domain.entities.TicketOffer;

@Data
@Builder
public class UpdateTicketOfferByIdRes {
    TicketOffer ticketOffer;
}
