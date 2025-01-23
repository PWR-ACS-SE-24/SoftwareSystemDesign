/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticketoffer;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Schema(
        description =
                "Represents a single fare ticket offer, which is a one-time use ticket with a fixed"
                        + " price.")
public final class SingleFareOfferDto extends TicketOfferDto {

    @Schema(
            description =
                    "The scope of the ticket offer. For single fare offers, this will always be"
                            + " 'single-fare'.",
            example = "single-fare")
    private final String scope = "single-fare";
}
