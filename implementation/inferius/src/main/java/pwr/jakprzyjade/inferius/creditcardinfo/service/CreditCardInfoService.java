package pwr.jakprzyjade.inferius.creditcardinfo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pwr.jakprzyjade.inferius.creditcardinfo.database.*;
import pwr.jakprzyjade.inferius.fine.database.Fine;
import pwr.jakprzyjade.inferius.shared.UUIDv7Validator;
import pwr.jakprzyjade.inferius.shared.exceptions.ResourceNotFoundException;
import pwr.jakprzyjade.inferius.wallet.database.Wallet;
import pwr.jakprzyjade.inferius.wallet.database.WalletHistoryRepository;
import pwr.jakprzyjade.inferius.wallet.database.WalletRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreditCardInfoService {

    private final CreditCardInfoRepository creditCardInfoRepository;
    private final WalletRepository walletRepository;

    public List<CreditCardDto> getCreditCards(UUID userId) {
        List<CreditCardInfo> creditCards = creditCardInfoRepository.findByWalletPassengerId(userId);

        if (creditCards.isEmpty()) {
            throw new ResourceNotFoundException("No credit cards found for user ID: " + userId);
        }

        return creditCards.stream()
                .map(card -> CreditCardDto.builder()
                        .id(card.getId())
                        .label(card.getLabel())
                        .number(card.getNumber())
                        .holderName(card.getHolderName())
                        .expirationDate(card.getExpirationDate())
                        .build())
                .toList();
    }

    public CreditCardDto updateCreditCard(UUID cardId, UpdateCreditCardDto updateDto, UUID userId) {
        CreditCardInfo card = creditCardInfoRepository.findByIdAndWalletPassengerId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Credit card not found or you are not authorized."));

        CreditCardInfo updatedCard = CreditCardInfo.builder()
                .id(card.getId())
                .wallet(card.getWallet())
                .number(card.getNumber())
                .holderName(card.getHolderName())
                .label(updateDto.getLabel() != null ? updateDto.getLabel() : card.getLabel())
                .expirationDate(updateDto.getExpirationDate() != null ? updateDto.getExpirationDate() : card.getExpirationDate())
                .build();

        CreditCardInfo savedCard = creditCardInfoRepository.save(updatedCard);

        return CreditCardDto.builder()
                .id(savedCard.getId())
                .label(savedCard.getLabel())
                .number(savedCard.getNumber())
                .holderName(savedCard.getHolderName())
                .expirationDate(savedCard.getExpirationDate())
                .build();
    }

    public void deleteCreditCard(UUID cardId, UUID userId) {
        CreditCardInfo card = creditCardInfoRepository.findByIdAndWalletPassengerId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Credit card not found or you are not authorized."));

        creditCardInfoRepository.delete(card);
    }

    public CreditCardDto addCreditCard(UUID userId, CreateCreditCardDto createDto) {
        Wallet wallet = walletRepository.findByPassengerId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));

        CreditCardInfo newCard = CreditCardInfo.builder()
                .label(createDto.getLabel())
                .number(createDto.getNumber())
                .holderName(createDto.getHolderName())
                .expirationDate(createDto.getExpirationDate())
                .wallet(wallet)
                .build();

        CreditCardInfo savedCard = creditCardInfoRepository.save(newCard);

        return CreditCardDto.builder()
                .id(savedCard.getId())
                .label(savedCard.getLabel())
                .number(savedCard.getNumber())
                .holderName(savedCard.getHolderName())
                .expirationDate(savedCard.getExpirationDate())
                .build();
    }
}
