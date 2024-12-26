package pwr.jakprzyjade.clabbert.application.abstractions.mediator;

/**
 * Represents a request that can be processed by a handler. This is a marker
 * interface for all requests handled through the Mediator pattern.
 *
 * @param <TResponse> The type of the response expected from handling this
 * request.
 */
public interface Request<TResponse> {}
