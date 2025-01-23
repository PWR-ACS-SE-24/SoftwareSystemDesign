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
                "Represents a long-term ticket offer, which is valid for a specific interval (e.g.,"
                        + " daily, weekly).")
public final class LongTermOfferDto extends TicketOfferDto {

    @Schema(
            description =
                    "The scope of the ticket offer. For long-term offers, this will always be"
                            + " 'long-term'.",
            example = "long-term")
    private final String scope = "long-term";

    @Schema(
            description = "The interval in days for which the long-term ticket offer is valid.",
            example = "30",
            required = true)
    private int intervalInDays;
}
