/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.validators.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import pwr.jakprzyjade.clabbert.api.validators.implementations.TicketOfferValidator;

@Constraint(validatedBy = TicketOfferValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidTicketOffer {
    String message() default "Invalid ticket offer configuration";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
