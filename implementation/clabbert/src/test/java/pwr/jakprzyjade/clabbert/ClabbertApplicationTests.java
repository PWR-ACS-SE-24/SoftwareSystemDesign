package pwr.jakprzyjade.clabbert;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClabbertApplicationTests {

    @Test
    void testTest() {
        Assertions.assertThat(2 + 2).isEqualTo(4);
    }
}
