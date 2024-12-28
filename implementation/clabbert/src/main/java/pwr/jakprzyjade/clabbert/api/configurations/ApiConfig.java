/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.configurations;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import pwr.jakprzyjade.clabbert.api.middlewares.InfoHeaderInterceptor;
import pwr.jakprzyjade.clabbert.api.middlewares.UserHeaderInterceptor;

@Configuration
@RequiredArgsConstructor
public class ApiConfig implements WebMvcConfigurer {

    private final UserHeaderInterceptor userHeaderInterceptor;
    private final InfoHeaderInterceptor infoHeaderInterceptor;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(userHeaderInterceptor).addPathPatterns("/ext/v1/**");
        registry.addInterceptor(infoHeaderInterceptor).addPathPatterns("/**");
    }
}
