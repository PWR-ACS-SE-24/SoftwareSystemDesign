package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@Getter
public class UserRoleHeaderMissing extends AbstractException {

    public UserRoleHeaderMissing() {
        super(HttpStatus.BAD_REQUEST, "user-role header is missing", "Brak nagłówka user-role w żądaniu");
    }
}
