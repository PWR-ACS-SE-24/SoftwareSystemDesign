package com.example.inferius.wallet.database;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class WalletHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false, precision = 8, scale = 2)
    @NotNull(message = "amountPln cannot be null")
    private BigDecimal amountPln;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "time cannot be null")
    private Instant time = Instant.now();

    @JoinColumn(name = "wallet_id")
    @ManyToOne
    private Wallet wallet;
}
