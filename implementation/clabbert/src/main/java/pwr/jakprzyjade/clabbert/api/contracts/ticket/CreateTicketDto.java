/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import pwr.jakprzyjade.clabbert.api.validators.annotations.ValidUUID;

@Data
public class CreateTicketDto {

    @Schema(
            description = "UUID of the ticket offer. Must be a valid UUID.",
            example = "01949440-1f41-740b-92bb-8f1f911505bd",
            pattern = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
            required = true)
    @ValidUUID
    private String offerId;
}
