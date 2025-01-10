/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.common;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import java.util.UUID;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

public class UUIDv7ServiceTest {

    @Test
    void uuidv7ServiceShouldGenerateValidUUID() {
        // given
        var sut = new UUIDv7Service();

        // when
        var uuid = sut.generate();

        // then
        assertDoesNotThrow(() -> UUID.fromString(uuid.toString()));
    }

    @Test
    void uuidv7ServiceShouldReturnTrueForValidUUID() {
        // given
        var sut = new UUIDv7Service();
        var uuid = UUID.randomUUID().toString();

        // when
        var result = sut.isStringValidUUID(uuid);

        // then
        Assertions.assertThat(result).isTrue();
    }

    @Test
    void uuidv7ServiceShouldReturnFalseForInvalidUUID() {
        // given
        var sut = new UUIDv7Service();
        var uuid = "INVALID UUID";

        // when
        var result = sut.isStringValidUUID(uuid);

        // then
        Assertions.assertThat(result).isFalse();
    }
}
