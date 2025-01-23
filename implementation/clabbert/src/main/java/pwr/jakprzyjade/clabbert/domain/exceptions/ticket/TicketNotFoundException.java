/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.exceptions.ticket;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class TicketNotFoundException extends AppException {
    public TicketNotFoundException() {
        super(HttpStatus.NOT_FOUND, "Ticket not found.", "Nie znaleziono biletu.");
    }
}
