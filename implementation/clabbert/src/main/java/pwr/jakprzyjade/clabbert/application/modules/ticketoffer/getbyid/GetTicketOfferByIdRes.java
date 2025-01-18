/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.getbyid;

import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.domain.entities.TicketOffer;

@Data
@Builder
public class GetTicketOfferByIdRes {
    TicketOffer ticketOffer;
}
