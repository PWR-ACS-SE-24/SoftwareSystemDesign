package com.example.phoenix;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.TimeBasedEpochRandomGenerator;

public class UUIDv7Generator {

    private static final TimeBasedEpochRandomGenerator UUID_GENERATOR =
            Generators.timeBasedEpochRandomGenerator();

    public String generate() {
        return UUID_GENERATOR.generate().toString();
    }
}