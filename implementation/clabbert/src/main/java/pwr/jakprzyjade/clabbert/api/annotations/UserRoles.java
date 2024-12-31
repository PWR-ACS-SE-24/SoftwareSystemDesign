/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import pwr.jakprzyjade.clabbert.application.abstractions.users.UserRole;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface UserRoles {

    UserRole[] value();
}
