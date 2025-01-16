package com.example.inferius.wallet.database;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "passengerId cannot be null")
    private Long passengerId;

    @Column(nullable = false, precision = 8, scale = 2)
    @NotNull(message = "passengerId cannot be null")
    private BigDecimal balancePln = BigDecimal.ZERO;
}
