package pwr.jakprzyjade.inferius.shared;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class UUIDv7Deserializer extends JsonDeserializer<UUID> {

    private final UUIDv7Validator uuidv7Validator;

    @Autowired
    public UUIDv7Deserializer(UUIDv7Validator uuidv7Validator) {
        this.uuidv7Validator = uuidv7Validator;
    }

    @Override
    public UUID deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        if (!uuidv7Validator.isStringValidUUID(value)) {
            throw new InvalidFormatException(p, "Invalid UUIDv7 format.", value, UUID.class);
        }
        return UUID.fromString(value);
    }
}
