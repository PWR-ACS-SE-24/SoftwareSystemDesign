package pwr.jakprzyjade.clabbert.application.common;

import java.lang.reflect.ParameterizedType;

import org.springframework.context.ApplicationContext;
import org.springframework.core.ResolvableType;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
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

        final var requestType = request.getClass();
        final var responseType = (Class<TResponse>) ((ParameterizedType) requestType.getGenericInterfaces()[0]).getActualTypeArguments()[0];

        final var beanNames = context.getBeanNamesForType(ResolvableType.forClassWithGenerics(RequestHandler.class, requestType, responseType));

        if (beanNames.length == 0) {
            throw new IllegalStateException("No handlers seemed to be registered to handle the given request. Make sure the handler is defined and marked as a spring component");
        } else if (beanNames.length > 1) {
            throw new IllegalStateException("More than one handlers found. Only one handler per request is allowed.");
        }

        final var requestHandler = (RequestHandler<Request<TResponse>, TResponse>) context.getBean(beanNames[0]);

        return requestHandler.handle(request);
    }

}
