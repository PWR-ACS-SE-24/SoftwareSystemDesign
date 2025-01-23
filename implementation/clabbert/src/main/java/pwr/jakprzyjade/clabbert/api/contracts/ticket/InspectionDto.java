/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InspectionDto {
    private String status;
    private String reason;
}
