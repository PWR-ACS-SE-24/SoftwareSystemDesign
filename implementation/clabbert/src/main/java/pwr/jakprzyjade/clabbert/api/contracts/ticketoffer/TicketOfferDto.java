/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticketoffer;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(
        description =
                "Represents the base structure for a ticket offer, which can be one of several"
                        + " types (single fare, time-limited, long-term).")
public abstract sealed class TicketOfferDto
        permits SingleFareOfferDto, TimeLimitedOfferDto, LongTermOfferDto {

    @Schema(
            description = "The unique identifier for the ticket offer, typically in UUID format.",
            example = "b5b089d1-4a4e-4b29-b410-c6881b56f292",
            required = true)
    private UUID id;

    @Schema(
            description = "The name of the offer in English.",
            example = "Single Fare Ticket",
            required = true)
    private String displayNameEn;

    @Schema(
            description = "The name of the offer in Polish.",
            example = "Bilet jednorazowy",
            required = true)
    private String displayNamePl;

    @Schema(
            description = "The type of the ticket offer such as standard or reduced.",
            example = "STANDARD",
            required = true,
            allowableValues = {"STANDARD", "REDUCED"})
    private String kind;

    @Schema(description = "The price of the offer in grosze.", example = "500", required = true)
    private int priceGrosze;
}
