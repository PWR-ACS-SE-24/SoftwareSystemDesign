package pwr.jakprzyjade.inferius.exceptions;

import pwr.jakprzyjade.inferius.shared.UUIDv7Validator;
import pwr.jakprzyjade.inferius.shared.exceptions.InfoHeaderInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class InfoHeaderInterceptorTest {

    @Mock
    private UUIDv7Validator uuidv7Validator;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private InfoHeaderInterceptor interceptor;

    private static final String VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";
    private static final String INVALID_UUID = "invalid-uuid";
    private static final String APP_VERSION = "1.0.0";

    @BeforeEach
    void setUp() throws NoSuchFieldException, IllegalAccessException {
        MockitoAnnotations.openMocks(this);
        interceptor = new InfoHeaderInterceptor(uuidv7Validator);

        Field appVersionField = InfoHeaderInterceptor.class.getDeclaredField("appVersion");
        appVersionField.setAccessible(true); // Ustawiamy pole jako dostępne
        appVersionField.set(interceptor, APP_VERSION);
    }

    @Test
    void shouldUseExistingValidRequestId() throws Exception {
        // Given
        when(request.getHeader("jp-request-id")).thenReturn(VALID_UUID);
        when(uuidv7Validator.isStringValidUUID(VALID_UUID)).thenReturn(true);

        // When
        boolean result = interceptor.preHandle(request, response, new Object());

        // Then
        assertTrue(result);
        verify(response).setHeader("jp-request-id", VALID_UUID);
        verify(response).setHeader("user-agent", "Inferius/" + APP_VERSION);
    }

    @Test
    void shouldGenerateRequestIdWhenInvalid() throws Exception {
        // Given
        when(request.getHeader("jp-request-id")).thenReturn(INVALID_UUID);
        when(uuidv7Validator.isStringValidUUID(INVALID_UUID)).thenReturn(false);
        when(uuidv7Validator.generate()).thenReturn(java.util.UUID.fromString(VALID_UUID));

        // When
        boolean result = interceptor.preHandle(request, response, new Object());

        // Then
        assertTrue(result);
        verify(response).setHeader("jp-request-id", VALID_UUID);
        verify(response).setHeader("user-agent", "Inferius/" + APP_VERSION);
    }

    @Test
    void shouldGenerateRequestIdWhenMissing() throws Exception {
        // Given
        when(request.getHeader("jp-request-id")).thenReturn(null);
        when(uuidv7Validator.generate()).thenReturn(java.util.UUID.fromString(VALID_UUID));

        // When
        boolean result = interceptor.preHandle(request, response, new Object());

        // Then
        assertTrue(result);
        verify(response).setHeader("jp-request-id", VALID_UUID);
        verify(response).setHeader("user-agent", "Inferius/" + APP_VERSION);
    }

    @Test
    void shouldSetUserAgentHeader() throws Exception {
        // Given
        when(request.getHeader("jp-request-id")).thenReturn(VALID_UUID);
        when(uuidv7Validator.isStringValidUUID(VALID_UUID)).thenReturn(true);

        // When
        boolean result = interceptor.preHandle(request, response, new Object());

        // Then
        assertTrue(result);
        verify(response).setHeader("user-agent", "Inferius/" + APP_VERSION);
    }

    @Test
    void shouldNotBreakWhenHandlerIsNull() throws Exception {
        // Given
        when(request.getHeader("jp-request-id")).thenReturn(null);
        when(uuidv7Validator.generate()).thenReturn(java.util.UUID.fromString(VALID_UUID));

        // When
        boolean result = interceptor.preHandle(request, response, null);

        // Then
        assertTrue(result);
        verify(response).setHeader("jp-request-id", VALID_UUID);
        verify(response).setHeader("user-agent", "Inferius/" + APP_VERSION);
    }
}
