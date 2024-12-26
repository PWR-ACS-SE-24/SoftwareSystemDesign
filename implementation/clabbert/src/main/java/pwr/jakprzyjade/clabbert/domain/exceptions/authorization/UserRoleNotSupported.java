/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@Getter
public class UserRoleNotSupported extends AbstractException {

    public UserRoleNotSupported() {
        super(
                HttpStatus.BAD_REQUEST,
                "User role is not supported by service",
                "Rola użytkownika nie jest obsługiwana przez serwis");
    }
}
