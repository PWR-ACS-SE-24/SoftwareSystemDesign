package pwr.jakprzyjade.inferius.creditcardinfo.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CreditCardInfoRepository extends JpaRepository<CreditCardInfo, UUID> {
    List<CreditCardInfo> findByWalletPassengerId(UUID passengerId);
    Optional<CreditCardInfo> findByIdAndWalletPassengerId(UUID id, UUID passengerId);
}
