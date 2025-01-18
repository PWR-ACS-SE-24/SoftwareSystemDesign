/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.exceptions.ticketoffer;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class TicketOfferTypeCannotBeChangedException extends AppException {
    public TicketOfferTypeCannotBeChangedException() {
        super(
                HttpStatus.BAD_REQUEST,
                "Ticket offer type cannot be changed during update.",
                "Nie można zmienić typu oferty biletu podczas aktualizacji.");
    }
}
