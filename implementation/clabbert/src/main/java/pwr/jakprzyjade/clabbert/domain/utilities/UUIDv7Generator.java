/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.domain.utilities;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.TimeBasedEpochRandomGenerator;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

public class UUIDv7Generator implements IdentifierGenerator {

    private static final TimeBasedEpochRandomGenerator UUID_GENERATOR =
            Generators.timeBasedEpochRandomGenerator(); // UUIDv7 generator

    @Override
    public Object generate(SharedSessionContractImplementor session, Object object) {
        return UUID_GENERATOR.generate();
    }
}
