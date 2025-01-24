/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(
        description =
                "Provides details about an API endpoint, including its HTTP method, path, and roles"
                        + " allowed to access it.")
public class EndpointInfo {

    @Schema(
            description = "The HTTP method of the endpoint.",
            example = "GET",
            required = true,
            allowableValues = {"GET", "POST", "PUT", "PATCH", "DELETE"})
    private String method;

    @Schema(description = "The path of the endpoint.", example = "/ext/v1/tickets", required = true)
    private String path;

    @Schema(
            description = "The roles allowed to access the endpoint.",
            example = "[\"passenger\", \"admin\"]",
            required = true,
            allowableValues = {"guest", "passenger", "driver", "admin", "inspector"})
    private List<String> roles;
}
