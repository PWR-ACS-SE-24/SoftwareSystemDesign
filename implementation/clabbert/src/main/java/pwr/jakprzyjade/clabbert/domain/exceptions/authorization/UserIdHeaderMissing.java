package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@Getter
public class UserIdHeaderMissing extends AbstractException {

    public UserIdHeaderMissing() {
        super(HttpStatus.BAD_REQUEST, "user-id header is missing", "Brak nagłówka user-id w żądaniu");
    }
}
