/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationDto {
    private Instant time;
    private String vehicleSideNumber;
}
