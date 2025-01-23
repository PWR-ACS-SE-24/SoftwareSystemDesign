/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.inspect;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.lepreachaun.LeprechaunService;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketRepository;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketActiveService;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketInspection;
import pwr.jakprzyjade.clabbert.domain.entities.SingleFareOffer;
import pwr.jakprzyjade.clabbert.domain.entities.Ticket;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Service
@RequiredArgsConstructor
public class InspectTicketHandler implements RequestHandler<InspectTicketReq, InspectTicketRes> {
    private final TicketRepository ticketRepository;
    private final LeprechaunService leprechaunService;
    private final TicketActiveService ticketActiveService;

    @Override
    public InspectTicketRes handle(InspectTicketReq request) throws AppException {
        final var routeId =
                UUID.fromString(
                        leprechaunService
                                .getRouteIdFromVehicleSideNumber(
                                        request.getVehicleSideNumber(), request.getRequestUuid())
                                .getId());

        final var ticketInspection =
                ticketRepository
                        .findById(request.getId())
                        .map(t -> mapToTicketInspection(t, routeId, request))
                        .orElse(TicketInspection.TICKET_NOT_FOUND);

        return new InspectTicketRes(ticketInspection);
    }

    private TicketInspection mapToTicketInspection(
            Ticket ticket, UUID routeId, InspectTicketReq request) {
        if (ticket.getValidation() == null) {
            return TicketInspection.TICKET_NOT_VALIDATED;
        }

        if (!ticketActiveService.isActive(ticket, request.getRequestUuid())) {
            return TicketInspection.TICKET_EXPIRED;
        }

        if (ticket.getOffer() instanceof SingleFareOffer
                && !ticket.getValidation().getRouteId().equals(routeId)) {
            return TicketInspection.TICKET_NOT_VALID_FOR_ROUTE;
        }

        return TicketInspection.TICKET_VALID;
    }
}
