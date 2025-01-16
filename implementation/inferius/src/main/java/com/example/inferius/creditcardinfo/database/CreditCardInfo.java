package com.example.inferius.creditcardinfo.database;

import com.example.inferius.internal.UUIDv7;
import com.example.inferius.wallet.database.Wallet;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CreditCardInfo {
    @Id
    @UUIDv7
    private UUID id;

    @Size(max = 255, message = "label max length is 255 characters")
    private String label;

    @Column(nullable = false, updatable = false, length = 16)
    @NotNull(message = "number cannot be null")
    @Size(min = 16, max = 16, message = "number has 16 characters")
    private String number;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "holderName cannot be null")
    @Size(min = 1, max = 255, message = "holderName must be between 1 and 255 characters")
    private String holderName;

    @Column(nullable = false)
    @NotNull(message = "expirationDate cannot be null")
    private String expirationDate;

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;
}
