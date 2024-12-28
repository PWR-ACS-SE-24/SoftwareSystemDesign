/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.middlewares;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import pwr.jakprzyjade.clabbert.api.annotations.UserRoles;
import pwr.jakprzyjade.clabbert.application.abstractions.users.UserData;
import pwr.jakprzyjade.clabbert.application.abstractions.users.UserRole;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserIdHeaderMissingException;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserIdHeaderNotValidException;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserRoleHeaderMissingException;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserRoleNotSupportedException;
import pwr.jakprzyjade.clabbert.domain.exceptions.authorization.UserUnauthorizedException;

@Component
public class UserHeaderInterceptor implements HandlerInterceptor {

    private static final List<String> SUPPORTED_ROLES =
            Arrays.stream(UserRole.values()).map(Enum::name).toList();

    private static final Pattern UUID_REGEX =
            Pattern.compile(
                    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    private static final UUID NIL_UUID = new UUID(0, 0);

    @Override
    public boolean preHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler)
            throws Exception {
        var userRole = request.getHeader("jp-user-role");
        var userId = request.getHeader("jp-user-id");

        if (userRole == null) {
            throw new UserRoleHeaderMissingException();
        }

        if (userId == null) {
            throw new UserIdHeaderMissingException();
        }

        if (!SUPPORTED_ROLES.contains(userRole.toUpperCase())) {
            throw new UserRoleNotSupportedException();
        }

        if (!UUID_REGEX.matcher(userId).matches()) {
            throw new UserIdHeaderNotValidException();
        }

        var userRoleEnum = UserRole.valueOf(userRole.toUpperCase());
        var userIdUUID = UUID.fromString(userId);
        var requiredRoles = getRequiredRoles(handler);

        if (requiredRoles.map(roles -> !roles.contains(userRoleEnum)).orElse(false)) {
            throw new UserUnauthorizedException();
        }

        if (userRoleEnum == UserRole.GUEST && !NIL_UUID.equals(userIdUUID)) {
            throw new UserIdHeaderNotValidException();
        }

        var userData = UserData.builder().id(userIdUUID).role(userRoleEnum).build();

        request.setAttribute("userData", userData);
        return true;
    }

    private Optional<List<UserRole>> getRequiredRoles(Object handler) {
        if (handler instanceof HandlerMethod handlerMethod) {
            var methodAnnotation = handlerMethod.getMethodAnnotation(UserRoles.class);
            if (methodAnnotation != null) {
                return Optional.of(Arrays.asList(methodAnnotation.value()));
            }

            var classAnnotation = handlerMethod.getBeanType().getAnnotation(UserRoles.class);
            if (classAnnotation != null) {
                return Optional.of(Arrays.asList(classAnnotation.value()));
            }
        }
        return Optional.empty();
    }
}
