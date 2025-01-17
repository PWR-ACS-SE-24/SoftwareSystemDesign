package com.example.inferius.shared;

import com.fasterxml.uuid.Generators;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.regex.Pattern;
import com.fasterxml.uuid.impl.TimeBasedEpochRandomGenerator;

@Component
public class UUIDv7Validator {

    public static final UUID NIL_UUID = new UUID(0, 0);

    private static final Pattern UUID_REGEX =
            Pattern.compile(
                    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    private static final TimeBasedEpochRandomGenerator UUID_GENERATOR =
            Generators.timeBasedEpochRandomGenerator();

    public UUID generate() {
        return UUID_GENERATOR.generate();
    }

    public boolean isStringValidUUID(String uuid) {
        return UUID_REGEX.matcher(uuid).matches();
    }
}