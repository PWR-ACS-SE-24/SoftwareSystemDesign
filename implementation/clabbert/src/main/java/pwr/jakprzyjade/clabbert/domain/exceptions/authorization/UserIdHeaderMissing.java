package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@Getter
public class UserIdHeaderMissing extends AbstractException {

    public UserIdHeaderMissing() {
        super(
                HttpStatus.BAD_REQUEST,
                "user-id header is missing",
                "Brak nagłówka user-id w żądaniu");
    }
}
