/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.exceptions.internalservices.leprechaun;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@Getter
public class VehicleNotFoundException extends AppException {
    public VehicleNotFoundException() {
        super(HttpStatus.NOT_FOUND, "Vehicle not found.", "Nie znaleziono pojazdu.");
    }
}
