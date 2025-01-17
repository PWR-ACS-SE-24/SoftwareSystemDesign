package com.example.inferius.shared;

import com.example.inferius.shared.exceptions.InfoHeaderInterceptor;
import com.example.inferius.shared.exceptions.UserHeaderInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final UserHeaderInterceptor userHeaderInterceptor;
    private final InfoHeaderInterceptor infoHeaderInterceptor;

    public WebConfig(UserHeaderInterceptor userHeaderInterceptor, InfoHeaderInterceptor infoHeaderInterceptor) {
        this.userHeaderInterceptor = userHeaderInterceptor;
        this.infoHeaderInterceptor = infoHeaderInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(infoHeaderInterceptor).addPathPatterns("/**");
        registry.addInterceptor(userHeaderInterceptor).addPathPatterns("/ext/**");
    }
}
