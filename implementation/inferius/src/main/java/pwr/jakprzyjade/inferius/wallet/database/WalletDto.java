package pwr.jakprzyjade.inferius.wallet.database;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class WalletDto {
    private UUID id;
    private BigDecimal balance;
}
