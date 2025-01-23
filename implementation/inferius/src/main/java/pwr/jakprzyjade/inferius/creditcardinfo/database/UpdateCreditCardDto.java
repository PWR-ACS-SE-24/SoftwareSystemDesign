package pwr.jakprzyjade.inferius.creditcardinfo.database;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCreditCardDto {
    @Size(max = 255)
    private String label;

    @NotNull
    private String expirationDate;
}
