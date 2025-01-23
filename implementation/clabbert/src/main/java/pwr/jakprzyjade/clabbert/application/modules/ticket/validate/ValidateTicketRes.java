/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.validate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.domain.entities.Validation;

@Data
@Builder
@AllArgsConstructor
public class ValidateTicketRes {
    private Validation validation;
}
