package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@Getter
public class UserUnauthorized extends AbstractException {

    public UserUnauthorized() {
        super(
                HttpStatus.UNAUTHORIZED,
                "User is unauthorized to perform this operation",
                "Użytkownik jest nieautoryzowany do wykonania tej operacji");
    }
}
