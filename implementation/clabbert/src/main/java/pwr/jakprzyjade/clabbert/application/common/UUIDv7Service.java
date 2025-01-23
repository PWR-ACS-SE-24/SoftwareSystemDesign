/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.common;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.TimeBasedEpochRandomGenerator;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class UUIDv7Service {

    public static final UUID NIL_UUID = new UUID(0, 0);
    public static final String UUID_REGEX_STRING =
            "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";

    private static final Pattern UUID_REGEX = Pattern.compile(UUID_REGEX_STRING);

    private static final TimeBasedEpochRandomGenerator UUID_GENERATOR =
            Generators.timeBasedEpochRandomGenerator(); // UUIDv7 generator

    public UUID generate() {
        return UUID_GENERATOR.generate();
    }

    public boolean isStringValidUUID(String uuid) {
        return UUID_REGEX.matcher(uuid).matches();
    }
}
