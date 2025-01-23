/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.create;

import java.math.BigDecimal;
import java.time.Clock;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.inferius.InferiusService;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.inferius.dtos.ChargeRequestDto;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketOfferRepository;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketRepository;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketWithActive;
import pwr.jakprzyjade.clabbert.domain.entities.Ticket;
import pwr.jakprzyjade.clabbert.domain.entities.TicketStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;
import pwr.jakprzyjade.clabbert.domain.exceptions.ticketoffer.TicketOfferNotFoundException;

@Service
@RequiredArgsConstructor
public class CreateTicketHandler implements RequestHandler<CreateTicketReq, CreateTicketRes> {
    private final TicketRepository ticketRepository;
    private final TicketOfferRepository ticketOfferRepository;
    private final InferiusService inferiusService;
    private final Clock clock;

    @Override
    @Transactional
    public CreateTicketRes handle(CreateTicketReq request) throws AppException {
        final var ticketOffer =
                ticketOfferRepository
                        .findByIsActiveTrueAndId(request.getOfferId())
                        .orElseThrow(TicketOfferNotFoundException::new);

        var ticket =
                Ticket.builder()
                        .offer(ticketOffer)
                        .passengerId(request.getUserData().getId())
                        .purchaseTime(clock.instant())
                        .build();

        ticket = ticketRepository.save(ticket);
        var charge =
                ChargeRequestDto.builder()
                        .ticketId(ticket.getId().toString())
                        .priceGrosze(
                                ticketOffer
                                        .getPricePln()
                                        .multiply(BigDecimal.valueOf(100))
                                        .intValue())
                        .userId(request.getUserData().getId().toString())
                        .build();

        var response = inferiusService.charge(charge, request.getRequestUuid());

        if (response.is2xxSuccessful()) {
            ticket.setStatus(TicketStatus.PURCHASED);
            ticket = ticketRepository.save(ticket);
        }

        return new CreateTicketRes(
                TicketWithActive.builder().ticket(ticket).isActive(false).build());
    }
}
