/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.abstractions.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import pwr.jakprzyjade.clabbert.domain.entities.Ticket;

public interface TicketRepository {
    List<Ticket> findAll();

    Optional<Ticket> findById(UUID id);

    List<Ticket> findByPassengerId(UUID id);

    Ticket save(Ticket ticket);
}
