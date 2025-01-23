/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class UserIdHeaderNotValidException extends AppException {

    public UserIdHeaderNotValidException() {
        super(
                HttpStatus.BAD_REQUEST,
                "jp-user-id header is not valid UUID",
                "Nagłówek jp-user-id nie jest poprawnym UUID");
    }
}
