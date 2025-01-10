/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.entities;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@Entity
public class SingleFareOffer extends TicketOffer {}
