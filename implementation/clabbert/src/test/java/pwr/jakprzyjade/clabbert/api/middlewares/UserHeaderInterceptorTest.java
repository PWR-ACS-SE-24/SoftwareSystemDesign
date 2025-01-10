/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.middlewares;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.util.UUID;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.method.HandlerMethod;
import pwr.jakprzyjade.clabbert.api.annotations.UserRoles;
import pwr.jakprzyjade.clabbert.application.abstractions.users.UserRole;
import pwr.jakprzyjade.clabbert.application.common.UUIDv7Service;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserIdHeaderMissingException;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserIdHeaderNotValidException;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserRoleHeaderMissingException;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserRoleNotSupportedException;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserUnauthorizedException;

@ExtendWith(MockitoExtension.class)
public class UserHeaderInterceptorTest {
    private static final String REQUEST_ID = "01945167-3ef9-78fb-b188-3621ce4ecd15";

    @Mock private UUIDv7Service uuidv7Service;

    @InjectMocks private UserHeaderInterceptor sut;

    @Test
    void userHeaderInterceptorShouldSetUserDataAttribute() throws Exception {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = new Object();

        // when
        when(request.getHeader("jp-user-role")).thenReturn("ADMIN");
        when(request.getHeader("jp-user-id")).thenReturn(REQUEST_ID);
        when(uuidv7Service.isStringValidUUID(REQUEST_ID)).thenReturn(true);
        var result = sut.preHandle(request, response, handler);

        // then
        Assertions.assertThat(result).isTrue();
        Assertions.assertThat(request.getAttribute("userData"))
                .isNotNull()
                .hasFieldOrPropertyWithValue("role", UserRole.ADMIN)
                .hasFieldOrPropertyWithValue("id", UUID.fromString(REQUEST_ID));
    }

    @Test
    void userHeaderInterceptorShouldSetUserDataAttributeWhenHandlerAnnotatedWithUserRole()
            throws Exception {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = mock(HandlerMethod.class);
        var userRole = mock(UserRoles.class);

        // when
        when(request.getHeader("jp-user-role")).thenReturn("ADMIN");
        when(request.getHeader("jp-user-id")).thenReturn(REQUEST_ID);
        when(uuidv7Service.isStringValidUUID(REQUEST_ID)).thenReturn(true);
        when(handler.getMethodAnnotation(UserRoles.class)).thenReturn(userRole);
        when(userRole.value()).thenReturn(new UserRole[] {UserRole.ADMIN});
        var result = sut.preHandle(request, response, handler);

        // then
        Assertions.assertThat(result).isTrue();
        Assertions.assertThat(request.getAttribute("userData"))
                .isNotNull()
                .hasFieldOrPropertyWithValue("role", UserRole.ADMIN)
                .hasFieldOrPropertyWithValue("id", UUID.fromString(REQUEST_ID));
    }

    @Test
    void
            userHeaderInterceptorShouldSetUserDataAttributeWhenHandlerAnnotatedWithUserRoleForClassAnnotation()
                    throws Exception {
        // given
        @UserRoles({UserRole.ADMIN})
        class TestController {
            @SuppressWarnings("unused")
            public void TestControllerMethod() {}
        }

        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler =
                spy(
                        new HandlerMethod(
                                new TestController(),
                                TestController.class.getDeclaredMethod("TestControllerMethod")));
        var beanType = TestController.class;

        // when
        when(request.getHeader("jp-user-role")).thenReturn("ADMIN");
        when(request.getHeader("jp-user-id")).thenReturn(REQUEST_ID);
        when(uuidv7Service.isStringValidUUID(REQUEST_ID)).thenReturn(true);
        doReturn(beanType).when(handler).getBeanType();
        var result = sut.preHandle(request, response, handler);

        // then
        Assertions.assertThat(result).isTrue();
        Assertions.assertThat(request.getAttribute("userData"))
                .isNotNull()
                .hasFieldOrPropertyWithValue("role", UserRole.ADMIN)
                .hasFieldOrPropertyWithValue("id", UUID.fromString(REQUEST_ID));
    }

    @Test
    void userHeaderInterceptorShouldThrowUserRoleHeaderMissingException() {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = new Object();

        // when
        when(request.getHeader("jp-user-role")).thenReturn(null);
        var exception = Assertions.catchThrowable(() -> sut.preHandle(request, response, handler));

        // then
        Assertions.assertThat(exception).isInstanceOf(UserRoleHeaderMissingException.class);
    }

    @Test
    void userHeaderInterceptorShouldThrowUserIdHeaderMissingException() {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = new Object();

        // when
        when(request.getHeader("jp-user-role")).thenReturn("ADMIN");
        when(request.getHeader("jp-user-id")).thenReturn(null);
        var exception = Assertions.catchThrowable(() -> sut.preHandle(request, response, handler));

        // then
        Assertions.assertThat(exception).isInstanceOf(UserIdHeaderMissingException.class);
    }

    @Test
    void userHeaderInterceptorShouldThrowUserRoleNotSupportedException() {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = new Object();

        // when
        when(request.getHeader("jp-user-role")).thenReturn("NOT_SUPPORTED_ROLE");
        when(request.getHeader("jp-user-id")).thenReturn(REQUEST_ID);
        var exception = Assertions.catchThrowable(() -> sut.preHandle(request, response, handler));

        // then
        Assertions.assertThat(exception).isInstanceOf(UserRoleNotSupportedException.class);
    }

    @Test
    void userHeaderInterceptorShouldThrowUserIdHeaderNotValidException() {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = new Object();

        // when
        when(request.getHeader("jp-user-role")).thenReturn("ADMIN");
        when(request.getHeader("jp-user-id")).thenReturn("INCORRECT_UUID");
        var exception = Assertions.catchThrowable(() -> sut.preHandle(request, response, handler));

        // then
        Assertions.assertThat(exception).isInstanceOf(UserIdHeaderNotValidException.class);
    }

    @Test
    void userHeaderInterceptorShouldThrowUserUnauthorizedException() throws Exception {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = mock(HandlerMethod.class);
        var userRole = mock(UserRoles.class);

        // when
        when(request.getHeader("jp-user-role")).thenReturn("GUEST");
        when(request.getHeader("jp-user-id")).thenReturn(REQUEST_ID);
        when(uuidv7Service.isStringValidUUID(REQUEST_ID)).thenReturn(true);
        when(handler.getMethodAnnotation(UserRoles.class)).thenReturn(userRole);
        when(userRole.value()).thenReturn(new UserRole[] {UserRole.ADMIN});
        var exception = Assertions.catchThrowable(() -> sut.preHandle(request, response, handler));

        // then
        Assertions.assertThat(exception).isInstanceOf(UserUnauthorizedException.class);
    }

    @Test
    void userHeaderInterceptorShouldThrowUserIdHeaderNotValidExceptionForGuest() {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = new Object();

        // when
        when(request.getHeader("jp-user-role")).thenReturn("GUEST");
        when(request.getHeader("jp-user-id")).thenReturn(REQUEST_ID);
        when(uuidv7Service.isStringValidUUID(REQUEST_ID)).thenReturn(true);
        var exception = Assertions.catchThrowable(() -> sut.preHandle(request, response, handler));

        // then
        Assertions.assertThat(exception).isInstanceOf(UserIdHeaderNotValidException.class);
    }
}
