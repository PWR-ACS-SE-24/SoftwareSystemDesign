package com.example.inferius.wallet.database;

import com.example.inferius.internal.UUIDv7;
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

    @Column(nullable = false, updatable = false)
    @NotNull(message = "passengerId cannot be null")
    private Long passengerId;

    @Column(nullable = false, precision = 8, scale = 2)
    @NotNull(message = "passengerId cannot be null")
    private BigDecimal balancePln = BigDecimal.ZERO;
}
