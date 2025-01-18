/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.middlewares;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import pwr.jakprzyjade.clabbert.api.contracts.ErrorDto;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorDto> handleAbstractException(
            AppException exception, WebRequest request) {
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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException exception, WebRequest request) {
        final var strBuilder = new StringBuilder();

        exception
                .getBindingResult()
                .getAllErrors()
                .forEach(
                        error -> {
                            String fieldName;
                            try {
                                fieldName = ((FieldError) error).getField();
                            } catch (ClassCastException ex) {
                                fieldName = error.getObjectName();
                            }
                            final var message = error.getDefaultMessage();
                            strBuilder.append(String.format("%s: %s \n ", fieldName, message));
                        });

        final var body =
                ErrorDto.builder()
                        .code(HttpStatus.BAD_REQUEST.value())
                        .kind("invalid-request-data")
                        .messageEn(strBuilder.toString())
                        .messagePl(strBuilder.toString())
                        .build();

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolationException(
            ConstraintViolationException exception, WebRequest request) {
        final var strBuilder = new StringBuilder();

        exception
                .getConstraintViolations()
                .forEach(
                        violation -> {
                            final var propertyPath = violation.getPropertyPath().toString();
                            final var fieldName =
                                    propertyPath.substring(propertyPath.lastIndexOf('.') + 1);
                            final var message = violation.getMessage();
                            strBuilder.append(String.format("%s: %s \n", fieldName, message));
                        });

        final var body =
                ErrorDto.builder()
                        .code(HttpStatus.BAD_REQUEST.value())
                        .kind("invalid-path-parameters")
                        .messageEn(strBuilder.toString())
                        .messagePl(strBuilder.toString())
                        .build();

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
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
