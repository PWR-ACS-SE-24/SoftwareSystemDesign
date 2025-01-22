package pwr.jakprzyjade.inferius.fine.database;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FineRepository extends JpaRepository<Fine, UUID> {
    Page<Fine> findByPassengerIdOrInspectorId(UUID passengerId, UUID inspectorId, Pageable pageable);
}
