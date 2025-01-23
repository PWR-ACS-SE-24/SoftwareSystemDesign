/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.create;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketWithActive;

@Data
@Builder
@AllArgsConstructor
public class CreateTicketRes {
    private TicketWithActive ticketWithActive;
}
