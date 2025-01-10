/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.middlewares;

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
import pwr.jakprzyjade.clabbert.application.common.UUIDv7Service;

@ExtendWith(MockitoExtension.class)
public class InfoHeaderInterceptorTest {
    private static final String REQUEST_ID = "01945167-3ef9-78fb-b188-3621ce4ecd15";

    @Mock private UUIDv7Service uuidv7Service;

    @InjectMocks private InfoHeaderInterceptor sut;

    @Test
    void preHandleShouldSetRequestIdHeaderIfAlreadyPresent() throws Exception {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = new Object();

        // when
        when(request.getHeader("jp-request-id")).thenReturn(REQUEST_ID);
        when(uuidv7Service.isStringValidUUID(REQUEST_ID)).thenReturn(true);
        var result = sut.preHandle(request, response, handler);

        // then
        Assertions.assertThat(result).isTrue();
        Assertions.assertThat(response.getHeader("jp-request-id")).isEqualTo(REQUEST_ID);
    }

    @Test
    void preHandleShouldSetRequestIdHeaderIfAlreadyPresentAndIncorrect() throws Exception {
        // given
        var request = spy(new MockHttpServletRequest());
        var response = new MockHttpServletResponse();
        var handler = new Object();
        var incorrectUuidString = "INCORRECT UUID";

        // when
        when(request.getHeader("jp-request-id")).thenReturn(incorrectUuidString);
        when(uuidv7Service.isStringValidUUID(incorrectUuidString)).thenReturn(false);
        when(uuidv7Service.generate()).thenReturn(UUID.fromString(REQUEST_ID));
        var result = sut.preHandle(request, response, handler);

        // then
        Assertions.assertThat(result).isTrue();
        Assertions.assertThat(response.getHeader("jp-request-id")).isEqualTo(REQUEST_ID);
    }

    @Test
    void preHandleShouldSetRequestIdHeaderIfNotPresent() throws Exception {
        // given
        var request = new MockHttpServletRequest();
        var response = new MockHttpServletResponse();
        var handler = new Object();

        // when
        when(uuidv7Service.generate()).thenReturn(UUID.fromString(REQUEST_ID));
        var result = sut.preHandle(request, response, handler);

        // then
        Assertions.assertThat(result).isTrue();
        Assertions.assertThat(response.getHeader("jp-request-id")).isEqualTo(REQUEST_ID);
    }

    @Test
    void preHandleShouldSetUserAgentHeader() throws Exception {
        // given
        var request = new MockHttpServletRequest();
        var response = new MockHttpServletResponse();
        var handler = new Object();

        // when
        when(uuidv7Service.generate()).thenReturn(UUID.fromString(REQUEST_ID));
        var result = sut.preHandle(request, response, handler);

        // then
        Assertions.assertThat(result).isTrue();
        Assertions.assertThat(response.getHeader("user-agent")).startsWith("Clabbert/");
    }
}
