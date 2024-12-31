/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.middlewares;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import pwr.jakprzyjade.clabbert.api.contracts.ErrorDto;
import pwr.jakprzyjade.clabbert.domain.exceptions.AbstractException;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(AbstractException.class)
    public ResponseEntity<ErrorDto> handleAbstractException(
            AbstractException exception, WebRequest request) {
        final var kind =
                exception
                        .getClass()
                        .getSimpleName()
                        .replaceAll("([a-z])([A-Z])", "$1-$2")
                        .toLowerCase()
                        .replace("-exception", "");

        final var body =
                ErrorDto.builder()
                        .code(exception.getStatus().value())
                        .kind(kind)
                        .messageEn(exception.getMessageEn())
                        .messagePl(exception.getMessagePl())
                        .build();

        return new ResponseEntity<>(body, exception.getStatus());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorDto> handleNoHandlerFoundException(
            NoHandlerFoundException exception, WebRequest request) {
        final var body =
                ErrorDto.builder()
                        .code(HttpStatus.NOT_FOUND.value())
                        .kind("not-found")
                        .messageEn("The requested resource was not found.")
                        .messagePl("Żądany zasób nie został znaleziony.")
                        .build();

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleAll(Exception exception, WebRequest request) {
        final var body =
                ErrorDto.builder()
                        .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .kind("server-failure")
                        .messageEn("An internal server error occurred.")
                        .messagePl("Wystąpił wewnętrzny błąd serwera.")
                        .build();

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
