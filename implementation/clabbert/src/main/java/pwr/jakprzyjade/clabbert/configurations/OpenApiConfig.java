/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.configurations;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.parameters.HeaderParameter;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(
                        new Info()
                                .title("Clabbert API")
                                .version("1.0.0")
                                .description("API for Clabbert (Ticket Service) microservice"));
    }

    @Bean
    OperationCustomizer addUserIdHeader() {
        return (operation, handlerMethod) -> {
            operation.addParametersItem(
                    new HeaderParameter()
                            .name("jp-user-id")
                            .description("User ID")
                            .required(true)
                            .example("01949011-7d5b-7cde-936a-fe99b8d1040d"));
            return operation;
        };
    }

    @Bean
    OperationCustomizer addUserRoleHeader() {
        return (operation, handlerMethod) -> {
            operation.addParametersItem(
                    new HeaderParameter()
                            .name("jp-user-role")
                            .description("User Role")
                            .required(true)
                            .example("passenger"));
            return operation;
        };
    }

    @Bean
    GroupedOpenApi externalApi() {
        return GroupedOpenApi.builder().group("external").pathsToMatch("/ext/**").build();
    }

    @Bean
    GroupedOpenApi internalApi() {
        return GroupedOpenApi.builder().group("internal").pathsToMatch("/int/**").build();
    }
}
