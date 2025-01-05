/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import pwr.jakprzyjade.clabbert.domain.utilities.UUIDv7;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class TicketOffer {

    @Id @UUIDv7 private UUID id;

    @Column(nullable = false, length = 255)
    @NotNull(message = "displayNameEn cannot be null") @Size(min = 1, max = 255, message = "displayNameEn must be between 1 and 255 characters")
    private String displayNameEn;

    @Column(nullable = false, length = 255)
    @NotNull(message = "displayNamePl cannot be null") @Size(min = 1, max = 255, message = "displayNamePl must be between 1 and 255 characters")
    private String displayNamePl;

    @Column(nullable = false, length = 32, updatable = false)
    @Enumerated(EnumType.STRING)
    private TicketKind kind;

    @Column(nullable = false, precision = 6, scale = 2, updatable = false)
    @NotNull(message = "pricePln cannot be null") private BigDecimal pricePln;

    @Column(nullable = false)
    @NotNull(message = "isActive cannot be null") @Builder.Default
    private boolean isActive = true;
}
