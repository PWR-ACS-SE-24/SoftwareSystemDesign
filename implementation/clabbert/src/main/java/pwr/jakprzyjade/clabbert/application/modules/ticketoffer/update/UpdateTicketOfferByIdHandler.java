/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.update;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketOfferRepository;
import pwr.jakprzyjade.clabbert.application.abstractions.ticketoffer.TicketOfferType;
import pwr.jakprzyjade.clabbert.domain.entities.LongTermOffer;
import pwr.jakprzyjade.clabbert.domain.entities.SingleFareOffer;
import pwr.jakprzyjade.clabbert.domain.entities.TicketOffer;
import pwr.jakprzyjade.clabbert.domain.entities.TimeLimitedOffer;
import pwr.jakprzyjade.clabbert.domain.exceptions.ticketoffer.TicketOfferNotFoundException;
import pwr.jakprzyjade.clabbert.domain.exceptions.ticketoffer.TicketOfferTypeCannotBeChangedException;

@Component
@RequiredArgsConstructor
public class UpdateTicketOfferByIdHandler
        implements RequestHandler<UpdateTicketOfferByIdReq, UpdateTicketOfferByIdRes> {
    private final TicketOfferRepository ticketOfferRepository;

    @Override
    public UpdateTicketOfferByIdRes handle(UpdateTicketOfferByIdReq request)
            throws TicketOfferNotFoundException, TicketOfferTypeCannotBeChangedException {
        var offer =
                ticketOfferRepository
                        .findByIsActiveTrueAndId(request.getId())
                        .orElseThrow(TicketOfferNotFoundException::new);
        final var offerKind = TicketOfferType.fromOffer(offer);

        offer.setActive(false);
        offer = ticketOfferRepository.save(offer);

        var updatedOffer = updateTicketOffer(request, offer, offerKind);
        updatedOffer = ticketOfferRepository.save(updatedOffer);

        return UpdateTicketOfferByIdRes.builder().ticketOffer(updatedOffer).build();
    }

    private TicketOffer updateTicketOffer(
            UpdateTicketOfferByIdReq request, TicketOffer offer, TicketOfferType offerType) {
        return switch (offerType) {
            case SINGLE_FARE ->
                    SingleFareOffer.builder()
                            .displayNameEn(
                                    request.getDisplayNameEn() != null
                                            ? request.getDisplayNameEn()
                                            : offer.getDisplayNameEn())
                            .displayNamePl(
                                    request.getDisplayNamePl() != null
                                            ? request.getDisplayNamePl()
                                            : offer.getDisplayNamePl())
                            .kind(request.getKind() != null ? request.getKind() : offer.getKind())
                            .pricePln(
                                    request.getPricePln() != null
                                            ? request.getPricePln()
                                            : offer.getPricePln())
                            .build();
            case LONG_TERM ->
                    LongTermOffer.builder()
                            .displayNameEn(
                                    request.getDisplayNameEn() != null
                                            ? request.getDisplayNameEn()
                                            : offer.getDisplayNameEn())
                            .displayNamePl(
                                    request.getDisplayNamePl() != null
                                            ? request.getDisplayNamePl()
                                            : offer.getDisplayNamePl())
                            .kind(request.getKind() != null ? request.getKind() : offer.getKind())
                            .pricePln(
                                    request.getPricePln() != null
                                            ? request.getPricePln()
                                            : offer.getPricePln())
                            .intervalInDays(
                                    request.getIntervalInDays() != null
                                            ? request.getIntervalInDays()
                                            : ((LongTermOffer) offer).getIntervalInDays())
                            .build();
            case TIME_LIMITED ->
                    TimeLimitedOffer.builder()
                            .displayNameEn(
                                    request.getDisplayNameEn() != null
                                            ? request.getDisplayNameEn()
                                            : offer.getDisplayNameEn())
                            .displayNamePl(
                                    request.getDisplayNamePl() != null
                                            ? request.getDisplayNamePl()
                                            : offer.getDisplayNamePl())
                            .kind(request.getKind() != null ? request.getKind() : offer.getKind())
                            .pricePln(
                                    request.getPricePln() != null
                                            ? request.getPricePln()
                                            : offer.getPricePln())
                            .duration(
                                    request.getDuration() != null
                                            ? request.getDuration()
                                            : ((TimeLimitedOffer) offer).getDuration())
                            .build();
        };
    }
}
