/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.TicketOfferDto;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketDto {
    private String id;
    private Instant purchaseTime;
    private TicketOfferDto offer;
    private ValidationDto validation;
    private String ticketStatus;
}
