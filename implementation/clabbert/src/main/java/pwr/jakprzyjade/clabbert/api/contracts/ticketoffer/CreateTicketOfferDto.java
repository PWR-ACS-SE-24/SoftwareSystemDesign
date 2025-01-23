/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticketoffer;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import pwr.jakprzyjade.clabbert.api.validators.annotations.ValidTicketOffer;

@Data
@ValidTicketOffer
public final class CreateTicketOfferDto {

    @Schema(
            description = "English display name for the ticket offer",
            example = "Standard Ticket",
            maxLength = 255)
    @NotBlank(message = "displayNameEn cannot be blank")
    @Size(max = 255, message = "displayNameEn must be max 255 characters")
    private String displayNameEn;

    @Schema(
            description = "Polish display name for the ticket offer",
            example = "Bilet standardowy",
            maxLength = 255)
    @NotBlank(message = "displayNamePl cannot be blank")
    @Size(max = 255, message = "displayNamePl must be max 255 characters")
    private String displayNamePl;

    @Schema(
            description = "Type of ticket offer: either STANDARD or REDUCED",
            example = "STANDARD",
            allowableValues = {"STANDARD", "REDUCED"})
    @NotBlank(message = "kind cannot be blank")
    @Pattern(regexp = "(?i)STANDARD|REDUCED", message = "kind must be either STANDARD or REDUCED")
    private String kind;

    @Schema(
            description = "Price of the ticket in grosze (1/100 of a PLN)",
            example = "1000",
            minimum = "0")
    @NotNull(message = "priceGrosze cannot be null")
    @Min(value = 0, message = "priceGrosze must be greater than or equal to 0")
    private Integer priceGrosze;

    @Schema(
            description =
                    "Scope of the ticket: long-term, single-fare, or time-limited. If long-term,"
                        + " intervalInDays must be provided. If time-limited, durationMinutes must"
                        + " be provided. If single-fare, both must be null.",
            example = "long-term",
            allowableValues = {"long-term", "single-fare", "time-limited"})
    @NotBlank(message = "scope cannot be blank")
    @Pattern(
            regexp = "(?i)long-term|single-fare|time-limited",
            message = "scope must be either long-term, single-fare or time-limited")
    private String scope;

    @Schema(
            description = "Interval in days for long-term tickets (if applicable)",
            example = "30",
            minimum = "1",
            nullable = true)
    @Nullable
    @Min(value = 1, message = "intervalInDays must be greater than or equal to 1")
    private Integer intervalInDays;

    @Schema(
            description = "Duration in minutes for time-limited tickets (if applicable)",
            example = "90",
            minimum = "1",
            nullable = true)
    @Nullable
    @Min(value = 1, message = "durationMinutes must be greater than or equal to 1")
    private Integer durationMinutes;
}
