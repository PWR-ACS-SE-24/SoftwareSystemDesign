/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.deletebyid;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketOfferRepository;
import pwr.jakprzyjade.clabbert.domain.exceptions.ticketoffer.TicketOfferNotFoundException;

@Component
@RequiredArgsConstructor
public class DeleteTicketOfferByIdHandler
        implements RequestHandler<DeleteTicketOfferByIdReq, DeleteTicketOfferByIdRes> {
    private final TicketOfferRepository ticketOfferRepository;

    @Override
    public DeleteTicketOfferByIdRes handle(DeleteTicketOfferByIdReq request)
            throws TicketOfferNotFoundException {
        var offer =
                ticketOfferRepository
                        .findByIsActiveTrueAndId(request.getId())
                        .orElseThrow(TicketOfferNotFoundException::new);
        offer.setActive(false);
        offer = ticketOfferRepository.save(offer);
        return DeleteTicketOfferByIdRes.builder().ticketOffer(offer).build();
    }
}
