/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.getbyid;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketRepository;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketActiveService;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketWithActive;
import pwr.jakprzyjade.clabbert.domain.entities.TicketStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;
import pwr.jakprzyjade.clabbert.domain.exceptions.ticket.TicketNotFoundException;

@Service
@RequiredArgsConstructor
public class GetTicketByIdHandler implements RequestHandler<GetTicketByIdReq, GetTicketByIdRes> {
    private final TicketRepository ticketRepository;
    private final TicketActiveService ticketActiveService;

    @Override
    public GetTicketByIdRes handle(GetTicketByIdReq request) throws AppException {

        final var ticket =
                ticketRepository
                        .findById(request.getId())
                        .filter(t -> t.getPassengerId().equals(request.getUserData().getId()))
                        .orElseThrow(TicketNotFoundException::new);

        var isActive = false;
        if (ticket.getStatus().equals(TicketStatus.PURCHASED) && ticket.getValidation() != null) {
            isActive = ticketActiveService.isActive(ticket, request.getRequestUuid());
        }

        return new GetTicketByIdRes(
                TicketWithActive.builder().ticket(ticket).isActive(isActive).build());
    }
}
