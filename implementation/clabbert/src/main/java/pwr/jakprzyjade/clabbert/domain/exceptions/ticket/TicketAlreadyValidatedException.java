/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.exceptions.ticket;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class TicketAlreadyValidatedException extends AppException {
    public TicketAlreadyValidatedException() {
        super(
                HttpStatus.BAD_REQUEST,
                "Ticket is already validated.",
                "Bilet był już skasowany.");
    }
}
