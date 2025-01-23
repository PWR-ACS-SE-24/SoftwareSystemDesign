/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.abstractions.internalservices.inferius.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChargeRequestDto {
    private String userId;
    private String ticketId;
    private int priceGrosze;
}
