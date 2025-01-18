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

    @Column(nullable = false, updatable = false)
    @NotNull(message = "passengerId cannot be null")
    private UUID passengerId;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "inspectorId cannot be null")
    private UUID inspectorId;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "recipient cannot be null")
    @Size(min = 1, max = 255, message = "recipient must be between 1 and 255 characters")
    private String recipient;

    @Min(value = 0)
    @Column(nullable = false, updatable = false, precision = 8, scale = 2)
    @NotNull(message = "amountPln cannot be null")
    private BigDecimal amountPln;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "time cannot be null")
    private Instant time = Instant.now();

    @Enumerated(EnumType.STRING)
    @NotNull(message = "reason cannot be null")
    @Column(nullable = false, updatable = false, length = 32)
    private FineReason reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    @NotNull(message = "status cannot be null")
    private FineStatus status = FineStatus.UNPAID;
}
