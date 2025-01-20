package pwr.jakprzyjade.inferius.wallet.database;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class WalletHistoryDto {
    private UUID id;
    private BigDecimal amount;
    private Instant time;
}