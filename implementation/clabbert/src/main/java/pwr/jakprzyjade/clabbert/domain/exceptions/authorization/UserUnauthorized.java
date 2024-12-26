package pwr.jakprzyjade.clabbert.domain.exceptions.authorization;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@Getter
public class UserUnauthorized extends AbstractException {

    public UserUnauthorized() {
        super(HttpStatus.UNAUTHORIZED, "User is unauthorized to perform this operation", "Użytkownik jest nieautoryzowany do wykonania tej operacji");
    }
}
