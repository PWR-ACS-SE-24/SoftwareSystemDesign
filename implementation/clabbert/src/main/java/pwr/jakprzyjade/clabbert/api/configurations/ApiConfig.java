/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.configurations;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import pwr.jakprzyjade.clabbert.api.middlewares.UserHeaderInterceptor;

@Configuration
@RequiredArgsConstructor
public class ApiConfig implements WebMvcConfigurer {

    @Autowired private final UserHeaderInterceptor userHeaderInterceptor;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(userHeaderInterceptor).addPathPatterns("/ext/v1/**");
    }
}
