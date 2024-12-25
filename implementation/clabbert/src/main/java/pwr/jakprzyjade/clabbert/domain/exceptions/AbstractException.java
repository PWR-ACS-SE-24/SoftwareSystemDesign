package pwr.jakprzyjade.clabbert.domain.exceptions;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public abstract class AbstractException extends Exception {

    private final HttpStatus status;
    private final String messageEn;
    private final String messagePl;

    public AbstractException(HttpStatus status, String messageEn, String messagePl) {
        super(messageEn);
        this.status = status;
        this.messageEn = messageEn;
        this.messagePl = messagePl;
    }
}
