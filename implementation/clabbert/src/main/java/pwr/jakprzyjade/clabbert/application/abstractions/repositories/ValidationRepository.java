/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.abstractions.repositories;

import pwr.jakprzyjade.clabbert.domain.entities.Validation;

public interface ValidationRepository {
    Validation save(Validation ticket);
}
