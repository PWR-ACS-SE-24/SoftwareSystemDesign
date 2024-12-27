/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@Getter
public class UserRoleHeaderMissingException extends AbstractException {

    public UserRoleHeaderMissingException() {
        super(
                HttpStatus.BAD_REQUEST,
                "jp-user-role header is missing",
                "Brak nagłówka jp-user-role w żądaniu");
    }
}
