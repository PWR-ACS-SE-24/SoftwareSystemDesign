/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EndpointInfo {
    private String method;
    private String path;
    private List<String> roles;
}
