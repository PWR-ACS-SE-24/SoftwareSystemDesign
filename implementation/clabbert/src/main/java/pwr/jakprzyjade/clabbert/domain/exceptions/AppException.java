/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.domain.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class AppException extends Exception {

    private final HttpStatus status;
    private final String messageEn;
    private final String messagePl;

    public AppException(HttpStatus status, String messageEn, String messagePl) {
        super(messageEn);
        this.status = status;
        this.messageEn = messageEn;
        this.messagePl = messagePl;
    }
}
