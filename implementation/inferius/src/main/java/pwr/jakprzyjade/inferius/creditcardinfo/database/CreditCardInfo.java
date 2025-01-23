package pwr.jakprzyjade.inferius.creditcardinfo.database;

import pwr.jakprzyjade.inferius.shared.UUIDv7;
import pwr.jakprzyjade.inferius.wallet.database.Wallet;
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

    @Size(max = 255)
    private String label;

    @Column(nullable = false, updatable = false, length = 16)
    @NotNull
    @Size(min = 16, max = 16)
    private String number;

    @Column(nullable = false, updatable = false)
    @NotNull
    @Size(min = 1, max = 255)
    private String holderName;

    @Column(nullable = false)
    @NotNull
    private String expirationDate;

    @ManyToOne
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;
}
