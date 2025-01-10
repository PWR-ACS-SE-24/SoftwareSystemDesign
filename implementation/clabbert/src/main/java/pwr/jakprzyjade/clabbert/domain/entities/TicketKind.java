/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.entities;

public enum TicketKind {
    STANDARD {
        @Override
        public double getDiscountPercent() {
            return 0.0;
        }
    },
    REDUCED {
        @Override
        public double getDiscountPercent() {
            return 50.0;
        }
    };

    public abstract double getDiscountPercent();
}
