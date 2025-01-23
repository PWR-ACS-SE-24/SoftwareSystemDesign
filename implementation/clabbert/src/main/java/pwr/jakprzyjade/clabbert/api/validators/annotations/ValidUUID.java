/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.validators.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import pwr.jakprzyjade.clabbert.application.common.UUIDv7Service;

@Documented
@Constraint(validatedBy = {})
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@NotBlank(message = "id cannot be blank")
@Pattern(regexp = UUIDv7Service.UUID_REGEX_STRING, message = "id must be a correct UUID")
public @interface ValidUUID {
    String message() default "Invalid UUID";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
