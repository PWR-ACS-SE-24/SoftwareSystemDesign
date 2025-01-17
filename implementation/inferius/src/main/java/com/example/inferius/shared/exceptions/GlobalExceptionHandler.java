package com.example.inferius.shared.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppError> handleGenericException(Exception ex) {
        return buildErrorResponse(500, "server-failure", "An unexpected error occurred.", "Wystąpił nieoczekiwany błąd serwera.");
    }

    private ResponseEntity<AppError> buildErrorResponse(int code, String kind, String messageEn, String messagePl) {
        return ResponseEntity.status(code)
                .body(new AppError(code, kind, messageEn, messagePl));
    }
}
