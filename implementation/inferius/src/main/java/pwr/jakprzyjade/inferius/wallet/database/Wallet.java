package pwr.jakprzyjade.inferius.wallet.database;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import pwr.jakprzyjade.inferius.shared.UUIDv7;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Wallet {

    @Id
    @UUIDv7
    private UUID id;

    @Column(nullable = false, updatable = false, unique = true)
    @NotNull
    private UUID passengerId;

    @Min(value = 0)
    @Column(nullable = false, precision = 8, scale = 2)
    @NotNull
    private BigDecimal balancePln = BigDecimal.ZERO;
}
