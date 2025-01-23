/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import lombok.Data;
import pwr.jakprzyjade.clabbert.api.validators.annotations.ValidUUID;

@Data
public class CreateTicketDto {
    @ValidUUID private String offerId;
}
