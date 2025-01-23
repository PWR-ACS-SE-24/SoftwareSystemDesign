/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.application.abstractions.mediator;

import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

/**
 * Acts as a mediator for handling requests and delegating them to the
 * appropriate handler. Simplifies communication by decoupling senders and
 * receivers of requests.
 */
public interface Mediator {

    /**
     * Sends a request to the appropriate handler and returns the response.
     *
     * @param <TResponse> The type of the response expected from the request.
     * @param request The request to send.
     * @return The response produced by the handler for the given request.
     */
    <TResponse> TResponse send(final Request<TResponse> request) throws AppException;
}
