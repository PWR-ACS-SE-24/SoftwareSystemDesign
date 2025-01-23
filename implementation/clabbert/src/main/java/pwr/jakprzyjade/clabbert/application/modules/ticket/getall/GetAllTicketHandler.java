/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.getall;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketRepository;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketActiveService;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketWithActive;
import pwr.jakprzyjade.clabbert.domain.entities.TicketStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Service
@RequiredArgsConstructor
public class GetAllTicketHandler implements RequestHandler<GetAllTicketReq, GetAllTicketRes> {
    private final TicketRepository ticketRepository;
    private final TicketActiveService ticketActiveService;

    @Override
    public GetAllTicketRes handle(GetAllTicketReq request) throws AppException {
        final var tickets = ticketRepository.findByPassengerId(request.getUserData().getId());

        List<TicketWithActive> ticketsWithActive =
                tickets.stream()
                        .map(
                                ticket -> {
                                    if (ticket.getStatus().equals(TicketStatus.PURCHASED)
                                            && ticket.getValidation() != null) {
                                        var isActive =
                                                ticketActiveService.isActive(
                                                        ticket, request.getRequestUuid());
                                        return TicketWithActive.builder()
                                                .ticket(ticket)
                                                .isActive(isActive)
                                                .build();
                                    } else {
                                        return TicketWithActive.builder()
                                                .ticket(ticket)
                                                .isActive(false)
                                                .build();
                                    }
                                })
                        .toList();

        return new GetAllTicketRes(ticketsWithActive);
    }
}
