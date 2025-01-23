/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.common;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationContext;
import org.springframework.core.ResolvableType;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Request;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@ExtendWith(MockitoExtension.class)
public class SpringMediatorTest {
    @Mock private ApplicationContext context;

    @InjectMocks private SpringMediator sut;

    class TestRequest implements Request<Integer> {}

    class TestHandler implements RequestHandler<TestRequest, Integer> {
        @Override
        public Integer handle(TestRequest request) {
            return 0;
        }
    }

    @Test
    void springMediatorShouldInvokeHandler() throws AppException {
        // given
        var request = new TestRequest();
        var handler = spy(new TestHandler());

        // when
        when(context.getBeanNamesForType(any(ResolvableType.class)))
                .thenReturn(new String[] {TestHandler.class.getName()});
        when(context.getBean(TestHandler.class.getName())).thenReturn(handler);
        var result = sut.send(request);

        // then
        verify(handler).handle(request);
        Assertions.assertThat(result).isNotNull().isEqualTo(0);
    }

    @Test
    void springMediatorShouldThrowExceptionWhenRequestIsNull() {
        // given
        TestRequest request = null;

        // when
        var exception = Assertions.catchThrowable(() -> sut.send(request));

        // then
        Assertions.assertThat(exception).isInstanceOf(NullPointerException.class);
    }

    @Test
    void springMediatorShouldThrowExceptionWhenNoHandlerFound() {
        // given
        var request = new TestRequest();

        // when
        when(context.getBeanNamesForType(any(ResolvableType.class))).thenReturn(new String[] {});
        var exception = Assertions.catchThrowable(() -> sut.send(request));

        // then
        Assertions.assertThat(exception).isInstanceOf(IllegalStateException.class);
    }

    @Test
    void springMediatorShouldThrowExceptionWhenMoreThanOneHandlerFound() {
        // given
        var request = new TestRequest();

        // when
        when(context.getBeanNamesForType(any(ResolvableType.class)))
                .thenReturn(
                        new String[] {TestHandler.class.getName(), TestHandler.class.getName()});
        var exception = Assertions.catchThrowable(() -> sut.send(request));

        // then
        Assertions.assertThat(exception).isInstanceOf(IllegalStateException.class);
    }
}
