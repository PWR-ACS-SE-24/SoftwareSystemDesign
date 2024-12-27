/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.domain.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

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
