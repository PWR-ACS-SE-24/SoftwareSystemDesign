package pwr.jakprzyjade.clabbert.application.common;

import java.lang.reflect.ParameterizedType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.core.ResolvableType;
import org.springframework.stereotype.Component;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Mediator;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Request;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;

@Component
@RequiredArgsConstructor
public class SpringMediator implements Mediator {

    private final ApplicationContext context;

    @Override
    public <TResponse> TResponse send(Request<TResponse> request) {
        if (request == null) {
            throw new NullPointerException("The given request object cannot be null");
        }

        var handlers = getBeanNames(RequestHandler.class, request);

        if (handlers.length == 0) {
            throw new IllegalStateException(
                    "No handlers seemed to be registered to handle the given request.");
        } else if (handlers.length > 1) {
            throw new IllegalStateException(
                    "More than one handlers found. Only one handler per request is allowed.");
        }

        final var requestHandler =
                (RequestHandler<Request<TResponse>, TResponse>) context.getBean(handlers[0]);

        return requestHandler.handle(request);
    }

    private <TResponse> String[] getBeanNames(Class<?> searchedType, Request<TResponse> request) {
        final var requestType = request.getClass();
        final var responseType =
                (Class<TResponse>)
                        ((ParameterizedType) requestType.getGenericInterfaces()[0])
                                .getActualTypeArguments()[0];

        return context.getBeanNamesForType(
                ResolvableType.forClassWithGenerics(searchedType, requestType, responseType));
    }
}
