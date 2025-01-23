/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketOfferRepository;
import pwr.jakprzyjade.clabbert.domain.entities.TicketOffer;

public interface JpaTicketOfferRepository
        extends TicketOfferRepository, JpaRepository<TicketOffer, UUID> {}
