/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.inspect;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketInspection;

@Data
@Builder
@AllArgsConstructor
public class InspectTicketRes {
    private TicketInspection inspection;
}
