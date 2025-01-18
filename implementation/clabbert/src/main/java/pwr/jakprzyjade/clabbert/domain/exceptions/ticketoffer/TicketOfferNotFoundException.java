/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.exceptions.ticketoffer;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class TicketOfferNotFoundException extends AppException {
    public TicketOfferNotFoundException() {
        super(HttpStatus.NOT_FOUND, "Ticket offer not found.", "Nie znaleziono oferty biletu.");
    }
}
