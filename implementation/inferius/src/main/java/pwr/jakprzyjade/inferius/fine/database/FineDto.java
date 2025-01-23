package pwr.jakprzyjade.inferius.fine.database;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class FineDto {
    private UUID id;
    private BigDecimal amountPln;
    private Instant time;
    private String recipient;
    private FineReason reason;
    private FineStatus status;
}
