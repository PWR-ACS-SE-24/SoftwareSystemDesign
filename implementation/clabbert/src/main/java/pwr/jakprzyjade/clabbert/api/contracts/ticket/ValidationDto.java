/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(
        description =
                "Represents the result of a ticket validation, including the time of validation and"
                        + " the vehicle side number.")
public class ValidationDto {

    @Schema(
            description =
                    "The time when the validation took place, represented as an ISO-8601 instant"
                            + " timestamp.",
            example = "2025-01-23T15:30:00Z",
            required = true)
    private Instant time;

    @Schema(
            description =
                    "The side number of the vehicle, which is typically used for identification"
                            + " during validation.",
            example = "A12",
            required = true)
    private String vehicleSideNumber;
}
