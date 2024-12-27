/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@Getter
public class UserIdHeaderMissingException extends AbstractException {

    public UserIdHeaderMissingException() {
        super(
                HttpStatus.BAD_REQUEST,
                "jp-user-id header is missing",
                "Brak nagłówka jp-user-id w żądaniu");
    }
}
