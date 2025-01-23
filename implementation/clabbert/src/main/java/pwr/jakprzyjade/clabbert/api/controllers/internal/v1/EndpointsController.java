/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.controllers.internal.v1;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pwr.jakprzyjade.clabbert.api.annotations.UserRoles;
import pwr.jakprzyjade.clabbert.api.contracts.EndpointInfo;

@RestController
@RequestMapping("/int/v1/endpoints")
@RequiredArgsConstructor
public class EndpointsController {
    private final ApplicationContext applicationContext;

    private static final Map<Class<?>, String> MAPPING_ANNOTATIONS =
            Map.of(
                    GetMapping.class, "GET",
                    PostMapping.class, "POST",
                    PutMapping.class, "PUT",
                    DeleteMapping.class, "DELETE",
                    PatchMapping.class, "PATCH");

    @GetMapping("/endpoints")
    public List<EndpointInfo> listEndpoints() {
        final var endpoints = new ArrayList<EndpointInfo>();

        final var beanNames = applicationContext.getBeanNamesForAnnotation(Controller.class);

        for (final var beanName : beanNames) {
            final var controller = applicationContext.getBean(beanName);
            final var controllerClass = controller.getClass();

            final var classRequestMapping =
                    AnnotationUtils.findAnnotation(controllerClass, RequestMapping.class);
            final var basePath =
                    classRequestMapping != null ? String.join("", classRequestMapping.path()) : "";

            final var methods = controllerClass.getDeclaredMethods();

            for (final var method : methods) {
                MAPPING_ANNOTATIONS.forEach(
                        (annotation, httpMethod) -> {
                            if (AnnotationUtils.findAnnotation(
                                            method, (Class<? extends Annotation>) annotation)
                                    != null) {
                                final var fullPath = resolvePath(basePath, method, annotation);

                                if (fullPath.startsWith("/ext")) {
                                    final var endpointInfo =
                                            EndpointInfo.builder()
                                                    .method(httpMethod)
                                                    .path(fullPath)
                                                    .roles(resolveRoles(method))
                                                    .build();
                                    endpoints.add(endpointInfo);
                                }
                            }
                        });
            }
        }

        return endpoints;
    }

    private String resolvePath(String basePath, Method method, Class<?> annotation) {
        final var annotationInstance =
                AnnotationUtils.findAnnotation(method, (Class<? extends Annotation>) annotation);

        final var methodPath =
                switch (annotationInstance) {
                    case GetMapping getMapping -> String.join(",", getMapping.path());
                    case PostMapping postMapping -> String.join(",", postMapping.path());
                    case PutMapping putMapping -> String.join(",", putMapping.path());
                    case DeleteMapping deleteMapping -> String.join(",", deleteMapping.path());
                    case PatchMapping patchMapping -> String.join(",", patchMapping.path());
                    case null -> "";
                    default -> "";
                };

        return basePath + methodPath;
    }

    private List<String> resolveRoles(Method method) {
        final var userRoles = AnnotationUtils.findAnnotation(method, UserRoles.class);
        if (userRoles != null) {
            return Arrays.stream(userRoles.value()).map(Enum::name).toList();
        }
        return new ArrayList<>();
    }
}
