package pwr.jakprzyjade.inferius.creditcardinfo.database;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateCreditCardDto {
    @Size(max = 255)
    private String label;

    @NotNull
    @Size(min = 16, max = 16)
    private String number;

    @NotNull
    @Size(min = 1, max = 255)
    private String holderName;

    @NotNull
    private String expirationDate;
}
