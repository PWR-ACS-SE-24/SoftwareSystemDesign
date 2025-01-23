/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.infrastructure.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.ValidationRepository;
import pwr.jakprzyjade.clabbert.domain.entities.Validation;

public interface JpaValidationRepository
        extends ValidationRepository, JpaRepository<Validation, UUID> {}
