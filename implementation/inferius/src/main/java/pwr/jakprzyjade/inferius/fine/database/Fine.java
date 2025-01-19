package pwr.jakprzyjade.inferius.fine.database;

import jakarta.validation.constraints.Min;
import pwr.jakprzyjade.inferius.shared.UUIDv7;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Fine {

    @Id
    @UUIDv7
    private UUID id;

    @Column(updatable = false)
    private UUID passengerId;

    @Column(nullable = false, updatable = false)
    @NotNull
    private UUID inspectorId;

    @Column(nullable = false, updatable = false)
    @NotNull
    @Size(min = 1, max = 255)
    private String recipient;

    @Min(value = 0)
    @Column(nullable = false, updatable = false, precision = 8, scale = 2)
    @NotNull
    private BigDecimal amountPln;

    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant time = Instant.now();

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false, updatable = false, length = 32)
    private FineReason reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    @NotNull
    private FineStatus status = FineStatus.UNPAID;
}
