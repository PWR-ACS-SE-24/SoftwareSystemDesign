/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticketoffer;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract sealed class TicketOfferDto
        permits SingleFareOfferDto, TimeLimitedOfferDto, LongTermOfferDto {
    private UUID id;
    private String displayNameEn;
    private String displayNamePl;
    private String kind;
    private int priceGrosze;

    public abstract String getScope();
}
