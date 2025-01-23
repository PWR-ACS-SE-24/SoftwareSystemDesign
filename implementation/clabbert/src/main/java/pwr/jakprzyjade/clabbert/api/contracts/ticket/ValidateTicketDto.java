/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ValidateTicketDto {
    @Schema(
            description =
                    "Side number of the vehicle being inspected. Must be between 1 and 16"
                            + " characters.",
            example = "12345",
            minLength = 1,
            maxLength = 16,
            required = true)
    @NotBlank(message = "Vehicle side number cannot be blank")
    @Size(min = 1, max = 16, message = "Vehicle side number must be between 1 and 16 characters")
    private String vehicleSideNumber;
}
