/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.middlewares;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import pwr.jakprzyjade.clabbert.application.common.UUIDv7Service;

@Component
@RequiredArgsConstructor
public class InfoHeaderInterceptor implements HandlerInterceptor {
    private final UUIDv7Service uuidv7Service;

    @Override
    public boolean preHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler)
            throws Exception {
        final var requestId = request.getHeader("jp-request-id");
        final var requestIdUUID =
                requestId == null || !uuidv7Service.isStringValidUUID(requestId)
                        ? uuidv7Service.generate()
                        : UUID.fromString(requestId);

        response.setHeader("jp-request-id", requestIdUUID.toString());

        final var version = getClass().getPackage().getImplementationVersion();
        response.setHeader("user-agent", "Clabbert/" + version);

        return true;
    }
}
