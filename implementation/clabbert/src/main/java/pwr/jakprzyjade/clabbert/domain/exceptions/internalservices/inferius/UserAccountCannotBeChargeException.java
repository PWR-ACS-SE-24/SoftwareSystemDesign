/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.exceptions.internalservices.inferius;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class UserAccountCannotBeChargeException extends AppException {
    public UserAccountCannotBeChargeException() {
        super(
                HttpStatus.BAD_REQUEST,
                "User account cannot be charged.",
                "Konto użytkownika nie może być obciążone.");
    }
}
