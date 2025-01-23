/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticketoffer;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public final class UpdateTicketOfferDto {

    @Schema(
            description = "Updated English display name for the ticket offer",
            example = "Updated Standard Ticket",
            maxLength = 255,
            nullable = true)
    @Nullable
    @Size(max = 255, message = "displayNameEn must be max 255 characters")
    private String displayNameEn;

    @Schema(
            description = "Updated Polish display name for the ticket offer",
            example = "Zaktualizowany bilet standardowy",
            maxLength = 255,
            nullable = true)
    @Nullable
    @Size(max = 255, message = "displayNamePl must be max 255 characters")
    private String displayNamePl;

    @Schema(
            description = "Updated type of ticket offer: either STANDARD or REDUCED",
            example = "REDUCED",
            allowableValues = {"STANDARD", "REDUCED"},
            nullable = true)
    @Nullable
    @Pattern(regexp = "(?i)STANDARD|REDUCED", message = "kind must be either STANDARD or REDUCED")
    private String kind;

    @Schema(
            description = "Updated price of the ticket in grosze (1/100 of a PLN)",
            example = "1500",
            minimum = "0",
            nullable = true)
    @Nullable
    @Min(value = 0, message = "priceGrosze must be greater than or equal to 0")
    private Integer priceGrosze;

    @Schema(
            description = "Updated scope of the ticket: long-term, single-fare, or time-limited",
            example = "single-fare",
            allowableValues = {"long-term", "single-fare", "time-limited"},
            nullable = true)
    @Nullable
    @Pattern(
            regexp = "(?i)long-term|single-fare|time-limited",
            message = "scope must be either long-term, single-fare or time-limited")
    private String scope;

    @Schema(
            description = "Updated interval in days for long-term tickets (if applicable)",
            example = "60",
            minimum = "1",
            nullable = true)
    @Nullable
    @Min(value = 1, message = "intervalInDays must be greater than or equal to 1")
    private Integer intervalInDays;

    @Schema(
            description = "Updated duration in minutes for time-limited tickets (if applicable)",
            example = "120",
            minimum = "1",
            nullable = true)
    @Nullable
    @Min(value = 1, message = "durationMinutes must be greater than or equal to 1")
    private Integer durationMinutes;
}
