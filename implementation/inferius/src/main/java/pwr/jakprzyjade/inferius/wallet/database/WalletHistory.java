package pwr.jakprzyjade.inferius.wallet.database;

import jakarta.validation.constraints.Min;
import pwr.jakprzyjade.inferius.shared.UUIDv7;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class WalletHistory {
    @Id
    @UUIDv7
    private UUID id;

    @Min(value = 0)
    @Column(nullable = false, updatable = false, precision = 8, scale = 2)
    @NotNull
    private BigDecimal amountPln;

    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant time = Instant.now();

    @JoinColumn(name = "wallet_id", nullable = false)
    @ManyToOne
    private Wallet wallet;
}
