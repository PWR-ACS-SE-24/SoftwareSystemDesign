/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.getall;

import java.util.List;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.domain.entities.TicketOffer;

@Data
@Builder
public class GetAllTicketOfferRes {
    List<TicketOffer> ticketOffers;
}
