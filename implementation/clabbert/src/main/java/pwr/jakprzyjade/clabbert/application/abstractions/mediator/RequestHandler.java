/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.application.abstractions.mediator;

import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

/**
 * Defines a handler responsible for processing a specific type of request. This
 * interface must be implemented for each request type that requires handling.
 *
 * @param <TRequest> The type of the request to be handled, which must extend
 * the {@link Request} interface.
 * @param <TResponse> The type of the response produced by handling the request.
 */
public interface RequestHandler<TRequest extends Request<TResponse>, TResponse> {

    /**
     * Handles the given request and produces a response.
     *
     * @param request The request to handle.
     * @return The response resulting from handling the request.
     */
    TResponse handle(final TRequest request) throws AppException;
}
