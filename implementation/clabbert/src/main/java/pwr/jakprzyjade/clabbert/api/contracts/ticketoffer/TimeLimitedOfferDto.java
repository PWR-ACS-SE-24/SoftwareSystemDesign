/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticketoffer;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(
        description =
                "Represents a time-limited ticket offer, which is valid for a set duration in"
                        + " minutes.")
public final class TimeLimitedOfferDto extends TicketOfferDto {

    @Schema(
            description =
                    "The scope of the ticket offer. For time-limited offers, this will always be"
                            + " 'time-limited'.",
            example = "time-limited")
    private final String scope = "time-limited";

    @Schema(
            description = "The duration in minutes for which the ticket offer is valid.",
            example = "60",
            required = true)
    private int durationMinutes;
}
