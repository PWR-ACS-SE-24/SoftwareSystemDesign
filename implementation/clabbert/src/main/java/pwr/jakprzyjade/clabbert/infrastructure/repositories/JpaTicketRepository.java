/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketRepository;
import pwr.jakprzyjade.clabbert.domain.entities.Ticket;

public interface JpaTicketRepository extends TicketRepository, JpaRepository<Ticket, UUID> {}
