package com.example.inferius.shared.exceptions;

import com.example.inferius.shared.UUIDv7Validator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserHeaderInterceptor implements HandlerInterceptor {

    private final UUIDv7Validator uuidv7Validator;

    // role użytkowników w systemie
    private static final EnumSet<UserRole> SUPPORTED_ROLES = EnumSet.allOf(UserRole.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // pobranie roli z nagłówka
        final String userRoleHeader = request.getHeader("jp-user-role");
        if (userRoleHeader == null || userRoleHeader.isEmpty()) {
            throw new UserRoleHeaderMissingException();
        }

        UserRole userRole;
        try {
            userRole = UserRole.valueOf(userRoleHeader.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new UserRoleNotSupportedException();
        }

        if (!SUPPORTED_ROLES.contains(userRole)) {
            throw new UserRoleNotSupportedException();
        }

        // pobranie id użytkownika z nagłówka
        final String userIdHeader = request.getHeader("jp-user-id");
        if (userIdHeader == null || userIdHeader.isEmpty()) {
            throw new UserIdHeaderMissingException();
        }

        if (!uuidv7Validator.isStringValidUUID(userIdHeader)) {
            throw new UserIdHeaderNotValidException(
                    "The header 'jp-user-id' is not a valid UUIDv7.",
                    "Nagłówek 'jp-user-id' nie jest poprawnym UUIDv7."
            );
        }

        final UUID userIdUUID = UUID.fromString(userIdHeader);

        if (userRole == UserRole.GUEST && !UUIDv7Validator.NIL_UUID.equals(userIdUUID)) {
            throw new UserIdHeaderNotValidException(
                    "Guest role must use NIL_UUID.",
                    "Nagłówek 'jp-user-id' musi być NIL_UUID dla roli gościa."
            );
        }

        // pobranie wymaganych ról dla metody badz endpointa
        final var requiredRoles = getRequiredRoles(handler);

        if (requiredRoles.map(roles -> !roles.contains(userRole)).orElse(false)) {
            throw new UserUnauthorizedException("User does not have sufficient permissions.");
        }

        response.setHeader("jp-user-id", userIdUUID.toString());
        response.setHeader("jp-user-role", userRole.name().toLowerCase());

        request.setAttribute("jp-user-id", userIdUUID);
        request.setAttribute("jp-user-role", userRole);

        return true;
    }

    private Optional<List<UserRole>> getRequiredRoles(Object handler) {
        if (handler instanceof HandlerMethod handlerMethod) {
            final var methodAnnotation = handlerMethod.getMethodAnnotation(UserRoles.class);
            if (methodAnnotation != null) {
                return Optional.of(List.of(methodAnnotation.value()));
            }
        }
        return Optional.empty();
    }
}
