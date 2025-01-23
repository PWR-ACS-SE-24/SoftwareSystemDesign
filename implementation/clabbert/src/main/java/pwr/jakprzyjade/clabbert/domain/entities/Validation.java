/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
public class Validation {
    @Id @UUIDv7 private UUID id;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "routeId cannot be null")
    private UUID routeId;

    @Column(nullable = false, updatable = false)
    @NotNull(message = "time cannot be null")
    @Builder.Default
    private Instant time = Instant.now();

    @Column(nullable = false, updatable = false)
    @NotNull(message = "vehicleSideNumber cannot be null")
    private String vehicleSideNumber;
}
