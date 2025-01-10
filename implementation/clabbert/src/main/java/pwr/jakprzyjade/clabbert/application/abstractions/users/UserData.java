/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.application.abstractions.users;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserData {
    private final UUID id;
    private final UserRole role;
}
