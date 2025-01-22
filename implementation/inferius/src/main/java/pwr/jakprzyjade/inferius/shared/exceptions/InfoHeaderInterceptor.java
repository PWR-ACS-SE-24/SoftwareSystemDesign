package pwr.jakprzyjade.inferius.shared.exceptions;

import pwr.jakprzyjade.inferius.shared.UUIDv7Validator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class InfoHeaderInterceptor implements HandlerInterceptor {

    private final UUIDv7Validator uuidv7Validator;

    @Value("${inferius.version}")
    private String appVersion;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // sprawdzenie lub wygenerowanie jp-request-id
        String requestId = request.getHeader("jp-request-id");
        if (requestId == null || !uuidv7Validator.isStringValidUUID(requestId)) {
            requestId = uuidv7Validator.generate().toString();
        }
        response.setHeader("jp-request-id", requestId);

        // dodanie nagłówka user-agent
        response.setHeader("user-agent", "Inferius/" + appVersion);

        return true;
    }
}
