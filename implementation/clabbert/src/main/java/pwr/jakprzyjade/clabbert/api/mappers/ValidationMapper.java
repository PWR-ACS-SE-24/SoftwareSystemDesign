/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import pwr.jakprzyjade.clabbert.api.contracts.ticket.ValidationDto;
import pwr.jakprzyjade.clabbert.domain.entities.Validation;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface ValidationMapper {
    ValidationDto toDto(Validation validation);
}
