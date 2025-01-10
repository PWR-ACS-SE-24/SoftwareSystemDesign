/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.utilities;

import java.util.UUID;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

public class UUIDv7GeneratorTest {

    private final UUIDv7Generator sut = new UUIDv7Generator();

    @Test
    void uuidGeneratorShouldGenerateUUID() {
        // given

        // when
        var uuid = sut.generate(null, null);

        // then
        Assertions.assertThat(uuid).isNotNull().isInstanceOf(UUID.class);
    }
}
