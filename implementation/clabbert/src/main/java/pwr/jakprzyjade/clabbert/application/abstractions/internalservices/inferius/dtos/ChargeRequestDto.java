/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.abstractions.internalservices.inferius.dtos;

import lombok.Data;

@Data
public class ChargeRequestDto {
    private String userId;
    private String ticketId;
}
