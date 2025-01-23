/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.getbyid;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketOfferRepository;
import pwr.jakprzyjade.clabbert.domain.exceptions.ticketoffer.TicketOfferNotFoundException;

@Component
@RequiredArgsConstructor
public class GetTicketOfferByIdHandler
        implements RequestHandler<GetTicketOfferByIdReq, GetTicketOfferByIdRes> {
    private final TicketOfferRepository ticketOfferRepository;

    @Override
    public GetTicketOfferByIdRes handle(GetTicketOfferByIdReq request)
            throws TicketOfferNotFoundException {
        final var offer =
                ticketOfferRepository
                        .findByIsActiveTrueAndId(request.getId())
                        .orElseThrow(TicketOfferNotFoundException::new);
        return GetTicketOfferByIdRes.builder().ticketOffer(offer).build();
    }
}
