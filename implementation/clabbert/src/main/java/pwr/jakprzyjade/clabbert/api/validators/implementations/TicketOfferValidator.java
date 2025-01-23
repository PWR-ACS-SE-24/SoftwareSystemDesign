/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.validators.implementations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.CreateTicketOfferDto;
import pwr.jakprzyjade.clabbert.api.validators.annotations.ValidTicketOffer;

public class TicketOfferValidator
        implements ConstraintValidator<ValidTicketOffer, CreateTicketOfferDto> {

    @Override
    public boolean isValid(CreateTicketOfferDto dto, ConstraintValidatorContext context) {
        if (dto == null) {
            return true; // Parent validator will handle this case
        }

        final var scope = dto.getScope();
        final var intervalInDays = dto.getIntervalInDays();
        final var durationMinutes = dto.getDurationMinutes();

        switch (scope.toLowerCase()) {
            case "single-fare" -> {
                if (intervalInDays != null || durationMinutes != null) {
                    context.disableDefaultConstraintViolation();
                    context.buildConstraintViolationWithTemplate(
                                    "For scope 'single-fare', intervalInDays and durationMinutes"
                                            + " must be null")
                            .addConstraintViolation();
                    return false;
                }
            }

            case "long-term" -> {
                if (intervalInDays == null || durationMinutes != null) {
                    context.disableDefaultConstraintViolation();
                    context.buildConstraintViolationWithTemplate(
                                    "For scope 'long-term', intervalInDays must not be null and"
                                            + " durationMinutes must be null")
                            .addConstraintViolation();
                    return false;
                }
            }

            case "time-limited" -> {
                if (intervalInDays != null || durationMinutes == null) {
                    context.disableDefaultConstraintViolation();
                    context.buildConstraintViolationWithTemplate(
                                    "For scope 'time-limited', intervalInDays must be null and"
                                            + " durationMinutes must not be null")
                            .addConstraintViolation();
                    return false;
                }
            }

            default -> {
                return true; // Parent validator will handle this case
            }
        }

        return true;
    }
}
