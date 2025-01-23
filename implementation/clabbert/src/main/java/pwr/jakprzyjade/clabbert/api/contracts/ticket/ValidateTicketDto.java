/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ValidateTicketDto {
    @NotBlank(message = "Vehicle side number cannot be blank")
    @Size(min = 1, max = 16, message = "Vehicle side number must be between 1 and 16 characters")
    private String vehicleSideNumber;
}
