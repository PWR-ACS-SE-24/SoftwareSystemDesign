package pwr.jakprzyjade.inferius.wallet.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WalletHistoryRepository extends JpaRepository<WalletHistory, UUID> {
    List<WalletHistory> findByWalletId(UUID walletId);
}
