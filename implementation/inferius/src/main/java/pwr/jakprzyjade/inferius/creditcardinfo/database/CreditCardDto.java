package pwr.jakprzyjade.inferius.creditcardinfo.database;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.UUID;

@Data
@AllArgsConstructor
@Getter
@Builder
public class CreditCardDto {
    private UUID id;
    private String label;
    private String number;
    private String holderName;
    private String expirationDate;
}
