/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.create;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketOfferRepository;
import pwr.jakprzyjade.clabbert.domain.entities.LongTermOffer;
import pwr.jakprzyjade.clabbert.domain.entities.SingleFareOffer;
import pwr.jakprzyjade.clabbert.domain.entities.TicketOffer;
import pwr.jakprzyjade.clabbert.domain.entities.TimeLimitedOffer;

@Component
@RequiredArgsConstructor
public class CreateTicketOfferHandler
        implements RequestHandler<CreateTicketOfferReq, CreateTicketOfferRes> {
    private final TicketOfferRepository ticketOfferRepository;

    @Override
    public CreateTicketOfferRes handle(CreateTicketOfferReq request) {
        var ticketOffer = createTicketOffer(request);
        ticketOffer = ticketOfferRepository.save(ticketOffer);
        return CreateTicketOfferRes.builder().ticketOffer(ticketOffer).build();
    }

    private TicketOffer createTicketOffer(CreateTicketOfferReq request) {
        return switch (request.getTicketOfferKind()) {
            case SINGLE_FARE ->
                    SingleFareOffer.builder()
                            .displayNameEn(request.getDisplayNameEn())
                            .displayNamePl(request.getDisplayNamePl())
                            .kind(request.getKind())
                            .pricePln(request.getPricePln())
                            .build();
            case LONG_TERM ->
                    LongTermOffer.builder()
                            .displayNameEn(request.getDisplayNameEn())
                            .displayNamePl(request.getDisplayNamePl())
                            .kind(request.getKind())
                            .pricePln(request.getPricePln())
                            .intervalInDays(request.getIntervalInDays())
                            .build();
            case TIME_LIMITED ->
                    TimeLimitedOffer.builder()
                            .displayNameEn(request.getDisplayNameEn())
                            .displayNamePl(request.getDisplayNamePl())
                            .kind(request.getKind())
                            .pricePln(request.getPricePln())
                            .duration(request.getDuration())
                            .build();
        };
    }
}
