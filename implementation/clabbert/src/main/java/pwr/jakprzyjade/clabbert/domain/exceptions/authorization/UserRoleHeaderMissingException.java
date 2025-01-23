/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class UserRoleHeaderMissingException extends AppException {

    public UserRoleHeaderMissingException() {
        super(
                HttpStatus.BAD_REQUEST,
                "jp-user-role header is missing",
                "Brak nagłówka jp-user-role w żądaniu");
    }
}
