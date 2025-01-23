/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import pwr.jakprzyjade.clabbert.api.contracts.ticket.TicketDto;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketWithActive;
import pwr.jakprzyjade.clabbert.domain.entities.TicketStatus;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        uses = {TicketOfferMapper.class, ValidationMapper.class})
public interface TicketMapper {

    @Mapping(source = "ticket.id", target = "id")
    @Mapping(source = "ticket.purchaseTime", target = "purchaseTime")
    @Mapping(source = "ticket.offer", target = "offer")
    @Mapping(source = "ticket.validation", target = "validation")
    @Mapping(target = "ticketStatus", expression = "java(mapTicketStatus(ticketWithActive))")
    TicketDto toDto(TicketWithActive ticketWithActive);

    default String mapTicketStatus(TicketWithActive ticketWithActive) {
        if (ticketWithActive.getTicket().getStatus().equals(TicketStatus.CANCELLED)
                || ticketWithActive.getTicket().getStatus().equals(TicketStatus.PENDING)) {
            return ticketWithActive.getTicket().getStatus().toString();
        } else if (ticketWithActive.getTicket().getValidation() == null) {
            return "NOT-VALIDATED";
        } else {
            return ticketWithActive.getIsActive() ? "ACTIVE" : "INACTIVE";
        }
    }
}
