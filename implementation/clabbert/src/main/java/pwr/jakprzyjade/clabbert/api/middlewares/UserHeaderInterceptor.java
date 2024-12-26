package pwr.jakprzyjade.clabbert.api.middlewares;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import pwr.jakprzyjade.clabbert.api.annotations.UserRoles;
import pwr.jakprzyjade.clabbert.domain.UserRole;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserIdHeaderMissing;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserRoleHeaderMissing;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserRoleNotSupported;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserUnauthorized;

@Component
public class UserHeaderInterceptor implements HandlerInterceptor {

    static private final List<String> supportedRoles = Arrays.stream(UserRole.values()).map(Enum::name).toList();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        var userId = request.getHeader("user-id");
        var userRole = request.getHeader("user-role");

        if (userRole == null) {
            throw new UserRoleHeaderMissing();
        }

        if (!supportedRoles.contains(userRole.toUpperCase())) {
            throw new UserRoleNotSupported();
        }

        var userRoleEnum = UserRole.valueOf(userRole.toUpperCase());
        var requiredRoles = getRequiredRoles(handler);

        if (userId == null && userRoleEnum != UserRole.GUEST) {
            throw new UserIdHeaderMissing();
        }

        if (requiredRoles.isPresent()
                && !List.of(requiredRoles.get()).contains(userRoleEnum)) {
            throw new UserUnauthorized();
        }

        request.setAttribute("userId", userId);
        request.setAttribute("userRole", userRoleEnum);
        return true;
    }

    private Optional<UserRole[]> getRequiredRoles(Object handler) {
        if (handler instanceof HandlerMethod handlerMethod) {
            var methodAnnotation = handlerMethod.getMethodAnnotation(UserRoles.class);
            if (methodAnnotation != null) {
                return Optional.of(methodAnnotation.value());
            }

            var classAnnotation = handlerMethod.getBeanType().getAnnotation(UserRoles.class);
            if (classAnnotation != null) {
                return Optional.of(classAnnotation.value());
            }
        }
        return Optional.empty();
    }
}
