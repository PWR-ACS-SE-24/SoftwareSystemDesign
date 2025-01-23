/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.getall;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketOfferRepository;

@Component
@RequiredArgsConstructor
public class GetAllTicketOfferHandler
        implements RequestHandler<GetAllTicketOfferReq, GetAllTicketOfferRes> {
    private final TicketOfferRepository ticketOfferRepository;

    @Override
    public GetAllTicketOfferRes handle(GetAllTicketOfferReq request) {
        final var activeOffer = ticketOfferRepository.findByIsActiveTrue();
        return GetAllTicketOfferRes.builder().ticketOffers(activeOffer).build();
    }
}
