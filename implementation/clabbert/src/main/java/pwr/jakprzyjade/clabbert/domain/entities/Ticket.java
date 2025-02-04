/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.jakprzyjade.clabbert.domain.utilities.UUIDv7;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Ticket {

    @Id @UUIDv7 private UUID id;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "passengerId cannot be null")
    private UUID passengerId;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "purchaseTime cannot be null")
    private Instant purchaseTime;

    @Column(nullable = false)
    @NotNull(message = "status cannot be null")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TicketStatus status = TicketStatus.PENDING;

    @JoinColumn(nullable = false, updatable = false, name = "offer_id")
    @NotNull(message = "offer cannot be null")
    @ManyToOne
    private TicketOffer offer;

    @JoinColumn(name = "validation_id")
    @OneToOne
    @Builder.Default
    private Validation validation = null;
}
