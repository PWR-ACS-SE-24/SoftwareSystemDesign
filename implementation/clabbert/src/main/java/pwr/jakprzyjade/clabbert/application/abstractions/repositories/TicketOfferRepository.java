/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.abstractions.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import pwr.jakprzyjade.clabbert.domain.entities.TicketOffer;

public interface TicketOfferRepository {
    List<TicketOffer> findByIsActiveTrue();

    Optional<TicketOffer> findByIsActiveTrueAndId(UUID id);

    <T extends TicketOffer> T save(T ticketOffer);

    long count();
}
