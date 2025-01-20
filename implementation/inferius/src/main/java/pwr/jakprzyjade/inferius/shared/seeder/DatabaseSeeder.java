package pwr.jakprzyjade.inferius.shared.seeder;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import pwr.jakprzyjade.inferius.creditcardinfo.database.CreditCardInfo;
import pwr.jakprzyjade.inferius.creditcardinfo.database.CreditCardInfoRepository;
import pwr.jakprzyjade.inferius.shared.UUIDv7Validator;
import pwr.jakprzyjade.inferius.wallet.database.Wallet;
import pwr.jakprzyjade.inferius.wallet.database.WalletRepository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Component
public class DatabaseSeeder {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UUIDv7Validator uuidv7Validator;

    public void run() {
        try {
            // Generate passenger and wallet
            UUID passengerId = uuidv7Validator.generate();
            System.out.println("Generated passenger ID: " + passengerId);

            UUID walletId = createOrGetWallet(passengerId);
            System.out.println("Inserted wallet with ID: " + walletId + " for passenger ID: " + passengerId);

            // Add credit cards
            for (int i = 1; i <= 2; i++) {
                UUID cardId = addCreditCard(walletId, "Card Label " + i, "123456781234567" + i, "Holder " + i, "12/2" + i);
                System.out.println("Inserted credit card with ID: " + cardId + " for wallet ID: " + walletId);
            }

            // Add wallet history
            for (int i = 1; i <= 5; i++) {
                addWalletHistory(walletId, BigDecimal.valueOf(100 + (i * 50)), Instant.now().minusSeconds(3600 * i));
            }
            System.out.println("Inserted wallet history entries.");

            // Add fines
            for (int i = 1; i <= 3; i++) {
                UUID fineId = addFine(
                        passengerId,
                        uuidv7Validator.generate(), // Inspector ID
                        "Recipient " + i,
                        BigDecimal.valueOf(100 + (10 * i)),
                        "NO_TICKET",
                        "UNPAID"
                );
                System.out.println("Inserted fine with ID: " + fineId);
            }
        } catch (Exception e) {
            System.err.println("Error during seeding: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private UUID createOrGetWallet(UUID passengerId) {
        UUID walletId = uuidv7Validator.generate();
        jdbcTemplate.update(
                "INSERT INTO wallet (id, passenger_id, balance_pln) VALUES (?, ?, ?) ON CONFLICT (passenger_id) DO NOTHING",
                walletId, passengerId, BigDecimal.valueOf(500)
        );
        return walletId;
    }

    private UUID addCreditCard(UUID walletId, String label, String number, String holderName, String expirationDate) {
        UUID cardId = uuidv7Validator.generate();
        jdbcTemplate.update(
                "INSERT INTO credit_card_info (id, wallet_id, label, number, holder_name, expiration_date) VALUES (?, ?, ?, ?, ?, ?)",
                cardId, walletId, label, number, holderName, expirationDate
        );
        return cardId;
    }

    private void addWalletHistory(UUID walletId, BigDecimal amount, Instant time) {
        UUID historyId = uuidv7Validator.generate();
        jdbcTemplate.update(
                "INSERT INTO wallet_history (id, wallet_id, amount_pln, time) VALUES (?, ?, ?, ?)",
                historyId, walletId, amount, time
        );
    }

    private UUID addFine(UUID passengerId, UUID inspectorId, String recipient, BigDecimal amount, String reason, String status) {
        UUID fineId = uuidv7Validator.generate();
        jdbcTemplate.update(
                "INSERT INTO fine (id, passenger_id, inspector_id, recipient, amount_pln, time, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                fineId, passengerId, inspectorId, recipient, amount, Instant.now(), reason, status
        );
        return fineId;
    }
}
