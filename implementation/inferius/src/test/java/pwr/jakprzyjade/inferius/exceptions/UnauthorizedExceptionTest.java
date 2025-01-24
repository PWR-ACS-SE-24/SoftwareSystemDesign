package pwr.jakprzyjade.inferius.exceptions;

import pwr.jakprzyjade.inferius.shared.exceptions.AppError;
import pwr.jakprzyjade.inferius.shared.exceptions.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.NoHandlerFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UnauthorizedExceptionTest {

    @InjectMocks
    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void shouldHandleNoHandlerFoundException() {
        // Given
        NoHandlerFoundException exception = new NoHandlerFoundException("GET", "/invalid-path", null);

        // When
        ResponseEntity<AppError> response = exceptionHandler.handleNoHandlerFoundException(exception);

        // Then
        assertEquals(404, response.getStatusCodeValue());
        assertEquals("resource-not-found", response.getBody().getKind());
        assertEquals("The requested resource was not found.", response.getBody().getMessageEn());
        assertEquals("Żądany zasób nie został znaleziony.", response.getBody().getMessagePl());
    }
}
