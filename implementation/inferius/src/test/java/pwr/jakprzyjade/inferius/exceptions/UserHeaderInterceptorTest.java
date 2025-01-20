package pwr.jakprzyjade.inferius.exceptions;

import pwr.jakprzyjade.inferius.shared.UUIDv7Validator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.method.HandlerMethod;
import pwr.jakprzyjade.inferius.shared.exceptions.*;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class UserHeaderInterceptorTest {

    @Mock
    private UUIDv7Validator uuidv7Validator;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private HandlerMethod handlerMethod;

    @InjectMocks
    private UserHeaderInterceptor interceptor;

    private static final String VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";
    private static final String INVALID_UUID = "invalid-uuid";
    private static final String NIL_UUID = "00000000-0000-0000-0000-000000000000";
    private static final String VALID_ROLE = "ADMIN";
    private static final String INVALID_ROLE = "INVALID_ROLE";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldAllowRequestWhenHeadersAreValid() throws Exception {
        // Given
        when(request.getHeader("jp-user-role")).thenReturn(VALID_ROLE);
        when(request.getHeader("jp-user-id")).thenReturn(VALID_UUID);
        when(uuidv7Validator.isStringValidUUID(VALID_UUID)).thenReturn(true);
        when(handlerMethod.getMethodAnnotation(UserRoles.class)).thenReturn(null);

        // When
        boolean result = interceptor.preHandle(request, response, handlerMethod);

        // Then
        assertTrue(result);
        verify(response).setHeader("jp-user-id", VALID_UUID);
        verify(response).setHeader("jp-user-role", VALID_ROLE.toLowerCase());
    }

    @Test
    void shouldThrowExceptionWhenUserRoleHeaderIsMissing() {
        // Given
        when(request.getHeader("jp-user-role")).thenReturn(null);

        // Then
        assertThrows(UserRoleHeaderMissingException.class, () ->
                interceptor.preHandle(request, response, handlerMethod));
    }

    @Test
    void shouldThrowExceptionWhenUserRoleIsInvalid() {
        // Given
        when(request.getHeader("jp-user-role")).thenReturn(INVALID_ROLE);

        // Then
        assertThrows(UserRoleNotSupportedException.class, () ->
                interceptor.preHandle(request, response, handlerMethod));
    }

    @Test
    void shouldThrowExceptionWhenUserIdHeaderIsMissing() {
        // Given
        when(request.getHeader("jp-user-role")).thenReturn(VALID_ROLE);
        when(request.getHeader("jp-user-id")).thenReturn(null);

        // Then
        assertThrows(UserIdHeaderMissingException.class, () ->
                interceptor.preHandle(request, response, handlerMethod));
    }

    @Test
    void shouldThrowExceptionWhenUserIdIsInvalid() {
        // Given
        when(request.getHeader("jp-user-role")).thenReturn(VALID_ROLE);
        when(request.getHeader("jp-user-id")).thenReturn(INVALID_UUID);
        when(uuidv7Validator.isStringValidUUID(INVALID_UUID)).thenReturn(false);

        // Then
        assertThrows(UserIdHeaderNotValidException.class, () ->
                interceptor.preHandle(request, response, handlerMethod));
    }

    @Test
    void shouldThrowExceptionWhenGuestUsesNonNilUuid() {
        // Given
        when(request.getHeader("jp-user-role")).thenReturn("GUEST");
        when(request.getHeader("jp-user-id")).thenReturn(VALID_UUID);
        when(uuidv7Validator.isStringValidUUID(VALID_UUID)).thenReturn(true);

        // Then
        assertThrows(UserIdHeaderNotValidException.class, () ->
                interceptor.preHandle(request, response, handlerMethod));
    }

    @Test
    void shouldThrowExceptionWhenUserRoleIsUnauthorized() {
        // Given
        when(request.getHeader("jp-user-role")).thenReturn("Passenger");
        when(request.getHeader("jp-user-id")).thenReturn(VALID_UUID);
        when(uuidv7Validator.isStringValidUUID(VALID_UUID)).thenReturn(true);

        UserRoles requiredRolesAnnotation = mock(UserRoles.class);
        when(requiredRolesAnnotation.value()).thenReturn(new UserRole[]{UserRole.ADMIN});
        when(handlerMethod.getMethodAnnotation(UserRoles.class)).thenReturn(requiredRolesAnnotation);

        // Then
        assertThrows(UserUnauthorizedException.class, () ->
                interceptor.preHandle(request, response, handlerMethod));
    }

    @Test
    void shouldAllowRequestWhenUserRoleIsAuthorized() throws Exception {
        // Given
        when(request.getHeader("jp-user-role")).thenReturn("ADMIN");
        when(request.getHeader("jp-user-id")).thenReturn(VALID_UUID);
        when(uuidv7Validator.isStringValidUUID(VALID_UUID)).thenReturn(true);

        UserRoles requiredRolesAnnotation = mock(UserRoles.class);
        when(requiredRolesAnnotation.value()).thenReturn(new UserRole[]{UserRole.ADMIN});
        when(handlerMethod.getMethodAnnotation(UserRoles.class)).thenReturn(requiredRolesAnnotation);

        // When
        boolean result = interceptor.preHandle(request, response, handlerMethod);

        // Then
        assertTrue(result);
        verify(response).setHeader("jp-user-id", VALID_UUID);
        verify(response).setHeader("jp-user-role", "admin");
    }
}
