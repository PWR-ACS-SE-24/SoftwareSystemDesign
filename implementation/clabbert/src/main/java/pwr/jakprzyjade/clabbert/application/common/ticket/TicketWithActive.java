/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.common.ticket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.jakprzyjade.clabbert.domain.entities.Ticket;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketWithActive {
    private Ticket ticket;
    private Boolean isActive;
}
