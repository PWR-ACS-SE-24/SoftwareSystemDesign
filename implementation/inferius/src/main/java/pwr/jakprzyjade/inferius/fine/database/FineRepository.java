package pwr.jakprzyjade.inferius.fine.database;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FineRepository extends JpaRepository<Fine, UUID> {
    Page<Fine> findByPassengerIdOrInspectorId(UUID passengerId, UUID inspectorId, Pageable pageable);
}
