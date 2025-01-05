/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.middlewares;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.TimeBasedEpochRandomGenerator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class InfoHeaderInterceptor implements HandlerInterceptor {

    private static final Pattern UUID_REGEX =
            Pattern.compile(
                    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    private static final TimeBasedEpochRandomGenerator UUID_GENERATOR =
            Generators.timeBasedEpochRandomGenerator(); // UUIDv7 generator

    @Override
    public boolean preHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler)
            throws Exception {
        final var requestId = request.getHeader("jp-request-id");
        final var requestIdUUID =
                requestId == null || !UUID_REGEX.matcher(requestId).matches()
                        ? UUID_GENERATOR.generate()
                        : UUID.fromString(requestId);

        response.setHeader("jp-request-id", requestIdUUID.toString());

        final var version = getClass().getPackage().getImplementationVersion();
        response.setHeader("user-agent", "Clabbert/" + version);

        return true;
    }
}
