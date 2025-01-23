/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.exceptions.internalservices;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class InternalServiceUnavailableException extends AppException {
    public InternalServiceUnavailableException() {
        super(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Failed to establish communication with the internal service.",
                " Nie udało się nawiązać komunikacji z usługą wewnętrzną.");
    }
}
