/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import pwr.jakprzyjade.clabbert.api.contracts.ticket.InspectionDto;
import pwr.jakprzyjade.clabbert.application.common.ticket.TicketInspection;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface InspectionMapper {

    @Mapping(target = "status", expression = "java(inspectionToStatus(inspection))")
    @Mapping(target = "reason", expression = "java(inspectionToReason(inspection))")
    InspectionDto toDto(TicketInspection inspection);

    default String inspectionToStatus(TicketInspection inspection) {
        return inspection == TicketInspection.TICKET_VALID ? "VALID" : "INVALID";
    }

    default String inspectionToReason(TicketInspection inspection) {
        return inspection.toString().replace("_", "-");
    }
}
