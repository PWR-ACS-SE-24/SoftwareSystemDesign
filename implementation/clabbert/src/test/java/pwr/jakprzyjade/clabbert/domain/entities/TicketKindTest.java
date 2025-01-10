/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.entities;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

public class TicketKindTest {

    @Test
    void ticketKindShouldHaveDiscountPercent() {
        // given
        var standard = TicketKind.STANDARD;
        var reduced = TicketKind.REDUCED;

        // when

        // then
        Assertions.assertThat(standard.getDiscountPercent()).isEqualTo(0.0);
        Assertions.assertThat(reduced.getDiscountPercent()).isEqualTo(50.0);
    }
}
