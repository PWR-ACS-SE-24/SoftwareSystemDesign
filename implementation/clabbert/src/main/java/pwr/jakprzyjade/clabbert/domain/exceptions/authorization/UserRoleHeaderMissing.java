package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@Getter
public class UserRoleHeaderMissing extends AbstractException {

    public UserRoleHeaderMissing() {
        super(
                HttpStatus.BAD_REQUEST,
                "user-role header is missing",
                "Brak nagłówka user-role w żądaniu");
    }
}
