package pwr.jakprzyjade.inferius.shared.exceptions;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserRoleHeaderMissingException.class)
    public ResponseEntity<AppError> handleUserRoleHeaderMissing(UserRoleHeaderMissingException ex) {
        return buildErrorResponse(400, "user-role-header-missing", ex.getMessage(), "Nagłówek 'jp-user-role' jest wymagany.");
    }

    @ExceptionHandler(UserRoleNotSupportedException.class)
    public ResponseEntity<AppError> handleUserRoleNotSupported(UserRoleNotSupportedException ex) {
        return buildErrorResponse(400, "user-role-not-supported", ex.getMessage(), "Rola w 'jp-user-role' nie jest obsługiwana.");
    }

    @ExceptionHandler(UserIdHeaderMissingException.class)
    public ResponseEntity<AppError> handleUserIdHeaderMissing(UserIdHeaderMissingException ex) {
        return buildErrorResponse(400, "user-id-header-missing", ex.getMessage(), "Nagłówek 'jp-user-id' jest wymagany.");
    }

    @ExceptionHandler(UserIdHeaderNotValidException.class)
    public ResponseEntity<AppError> handleUserIdHeaderNotValid(UserIdHeaderNotValidException ex) {
        return buildErrorResponse(400, "user-id-header-not-valid", ex.getMessage(), ex.getMessagePl());
    }

    @ExceptionHandler(UserUnauthorizedException.class)
    public ResponseEntity<AppError> handleUserUnauthorized(UserUnauthorizedException ex) {
        return buildErrorResponse(401, "user-unauthorized", ex.getMessage(), "Użytkownik nie jest autoryzowany.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppError> handleGenericException(Exception ex) {
        return buildErrorResponse(500, "server-failure", "An unexpected error occurred.", "Wystąpił nieoczekiwany błąd serwera.");
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<AppError> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        return buildErrorResponse(404, "resource-not-found", "The requested resource was not found.", "Żądany zasób nie został znaleziony."
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<AppError> handleResourceNotFound(ResourceNotFoundException ex) {
        return buildErrorResponse(404, "resource-not-found", ex.getMessage(), "Żądany zasób nie został znaleziony.");
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<AppError> handleIllegalStateException(IllegalStateException ex) {
        return buildErrorResponse(400, "illegal-state", ex.getMessage(), "Operacja jest niedozwolona.");
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<AppError> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        Throwable rootCause = ex.getRootCause();

        if (rootCause instanceof InvalidFormatException) {
            InvalidFormatException formatException = (InvalidFormatException) rootCause;
            if (formatException.getTargetType() == UUID.class) {
                return buildErrorResponse(
                        400,
                        "invalid-uuidv7",
                        "Invalid UUIDv7 format.",
                        "Nieprawidłowy format UUIDv7."
                );
            }
        }

        return buildErrorResponse(
                400,
                "invalid-input",
                "Invalid input data.",
                "Nieprawidłowe dane wejściowe."
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<AppError> handleIllegalArgumentException(IllegalArgumentException ex) {
        return buildErrorResponse(
                400,
                "invalid-argument",
                ex.getMessage(),
                "Nieprawidłowe dane wejściowe."
        );
    }

    private ResponseEntity<AppError> buildErrorResponse(int code, String kind, String messageEn, String messagePl) {
        return ResponseEntity.status(code)
                .body(new AppError(code, kind, messageEn, messagePl));
    }
}
