/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class UserIdHeaderMissingException extends AppException {

    public UserIdHeaderMissingException() {
        super(
                HttpStatus.BAD_REQUEST,
                "jp-user-id header is missing",
                "Brak nagłówka jp-user-id w żądaniu");
    }
}
