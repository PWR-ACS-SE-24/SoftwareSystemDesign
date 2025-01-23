/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.getbyid;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketWithActive;

@Data
@Builder
@AllArgsConstructor
public class GetTicketByIdRes {
    private TicketWithActive ticketWithActive;
}
