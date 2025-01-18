/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticketoffer;

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

    @NotBlank(message = "displayNameEn cannot be blank")
    @Size(max = 255, message = "displayNameEn must be max 255 characters")
    private String displayNameEn;

    @NotBlank(message = "displayNamePl cannot be blank")
    @Size(max = 255, message = "displayNamePl must be max 255 characters")
    private String displayNamePl;

    @NotBlank(message = "kind cannot be blank")
    @Pattern(regexp = "(?i)STANDARD|REDUCED", message = "kind must be either STANDARD or REDUCED")
    private String kind;

    @NotNull(message = "priceGrosze cannot be null")
    @Min(value = 0, message = "priceGrosze must be greater than or equal to 0")
    private Integer priceGrosze;

    @NotBlank(message = "scope cannot be blank")
    @Pattern(
            regexp = "(?i)long-term|single-fare|time-limited",
            message = "scope must be either long-term, single-fare or time-limited")
    private String scope;

    @Nullable
    @Min(value = 1, message = "intervalInDays must be greater than or equal to 1")
    private Integer intervalInDays;

    @Nullable
    @Min(value = 1, message = "durationMinutes must be greater than or equal to 1")
    private Integer durationMinutes;
}
