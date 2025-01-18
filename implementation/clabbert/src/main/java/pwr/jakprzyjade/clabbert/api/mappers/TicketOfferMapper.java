/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.mappers;

import java.math.BigDecimal;
import java.time.Duration;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.CreateTicketOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.LongTermOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.SingleFareOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.TicketOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.TimeLimitedOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.UpdateTicketOfferDto;
import pwr.jakprzyjade.clabbert.application.abstractions.ticketoffer.TicketOfferKind;
import pwr.jakprzyjade.clabbert.application.modules.ticketoffer.create.CreateTicketOfferReq;
import pwr.jakprzyjade.clabbert.application.modules.ticketoffer.update.UpdateTicketOfferByIdReq;
import pwr.jakprzyjade.clabbert.domain.entities.LongTermOffer;
import pwr.jakprzyjade.clabbert.domain.entities.SingleFareOffer;
import pwr.jakprzyjade.clabbert.domain.entities.TicketKind;
import pwr.jakprzyjade.clabbert.domain.entities.TicketOffer;
import pwr.jakprzyjade.clabbert.domain.entities.TimeLimitedOffer;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface TicketOfferMapper {
    default TicketOfferDto toDto(TicketOffer ticketOffer) {
        return switch (ticketOffer) {
            case SingleFareOffer offer -> toSingleFareTicketOfferDto(offer);
            case TimeLimitedOffer offer -> toTimeLimitedTicketOfferDto(offer);
            case LongTermOffer offer -> toLongTermTicketOfferDto(offer);
            default -> throw new IllegalStateException();
        };
    }

    @Mapping(source = "priceGrosze", target = "pricePln", qualifiedByName = "priceGroszeToPln")
    @Mapping(source = "kind", target = "kind", qualifiedByName = "kindFromString")
    @Mapping(
            source = "scope",
            target = "ticketOfferKind",
            qualifiedByName = "ticketOfferKindFromScope")
    @Mapping(
            source = "durationMinutes",
            target = "duration",
            qualifiedByName = "durationFromMinutes")
    CreateTicketOfferReq toReq(CreateTicketOfferDto createTicketOfferDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "priceGrosze", target = "pricePln", qualifiedByName = "priceGroszeToPln")
    @Mapping(source = "kind", target = "kind", qualifiedByName = "kindFromString")
    @Mapping(
            source = "scope",
            target = "ticketOfferKind",
            qualifiedByName = "ticketOfferKindFromScope")
    @Mapping(
            source = "durationMinutes",
            target = "duration",
            qualifiedByName = "durationFromMinutes")
    UpdateTicketOfferByIdReq toReq(UpdateTicketOfferDto updateTicketOfferDto);

    @Mapping(source = "pricePln", target = "priceGrosze", qualifiedByName = "pricePlnToGrosze")
    @Mapping(source = "kind", target = "kind", qualifiedByName = "kindToString")
    SingleFareOfferDto toSingleFareTicketOfferDto(SingleFareOffer singleFareOffer);

    @Mapping(source = "pricePln", target = "priceGrosze", qualifiedByName = "pricePlnToGrosze")
    @Mapping(source = "kind", target = "kind", qualifiedByName = "kindToString")
    LongTermOfferDto toLongTermTicketOfferDto(LongTermOffer longTermOffer);

    @Mapping(source = "pricePln", target = "priceGrosze", qualifiedByName = "pricePlnToGrosze")
    @Mapping(source = "kind", target = "kind", qualifiedByName = "kindToString")
    @Mapping(source = "duration", target = "durationMinutes", qualifiedByName = "durationInMinutes")
    TimeLimitedOfferDto toTimeLimitedTicketOfferDto(TimeLimitedOffer timeLimitedOffer);

    @Named("pricePlnToGrosze")
    default int pricePlnToGrosze(BigDecimal pricePln) {
        return pricePln.multiply(BigDecimal.valueOf(100)).intValue();
    }

    @Named("durationInMinutes")
    default int durationInMinutes(Duration duration) {
        return (int) duration.toMinutes();
    }

    @Named("kindToString")
    default String kindToString(TicketKind kind) {
        return kind.toString().toLowerCase();
    }

    @Named("kindFromString")
    default TicketKind kindFromString(String kind) {
        if (kind == null) {
            return null;
        }
        return TicketKind.valueOf(kind.toUpperCase());
    }

    @Named("priceGroszeToPln")
    default BigDecimal priceGroszeToPln(Integer priceGrosze) {
        if (priceGrosze == null) {
            return null;
        }
        return BigDecimal.valueOf(priceGrosze).divide(BigDecimal.valueOf(100));
    }

    @Named("ticketOfferKindFromScope")
    default TicketOfferKind ticketOfferKindFromScope(String scope) {
        if (scope == null) {
            return null;
        }
        return TicketOfferKind.valueOf(scope.toUpperCase().replace("-", "_"));
    }

    @Named("durationFromMinutes")
    default Duration durationFromMinutes(Integer durationMinutes) {
        if (durationMinutes == null) {
            return null;
        }
        return Duration.ofMinutes(durationMinutes);
    }
}
