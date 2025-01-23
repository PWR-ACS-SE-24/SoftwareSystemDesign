/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Represents the inspection status of a ticket with additional explanation")
public class InspectionDto {

    @Schema(
            description =
                    "The current status of the inspection, which indicates whether the inspection"
                            + " was successful or not.",
            example = "VALID",
            required = true,
            allowableValues = {"VALID", "INVALID"})
    private String status;

    @Schema(
            description =
                    "The reason for the inspection, providing additional context for why the"
                            + " inspection was performed.",
            example = "TICKET-VALID",
            required = true,
            allowableValues = {
                "TICKET-VALID",
                "TICKET-NOT-FOUND",
                "TICKET-NOT-VALIDATED",
                "TICKET-EXPIRED",
                "TICKET-NOT-VALID-FOR-ROUTE"
            })
    private String reason;
}
