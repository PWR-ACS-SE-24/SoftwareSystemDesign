package pwr.jakprzyjade.inferius.creditcardinfo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pwr.jakprzyjade.inferius.creditcardinfo.database.CreditCardInfoRepository;
import pwr.jakprzyjade.inferius.creditcardinfo.database.CreditCardDto;
import pwr.jakprzyjade.inferius.shared.UUIDv7Validator;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreditCardInfoService {

    private final CreditCardInfoRepository creditCardInfoRepository;

    public List<CreditCardDto> getCreditCards(String userId) {
        UUID userUUID = UUID.fromString(userId);
        return creditCardInfoRepository.findByWalletPassengerId(userUUID).stream()
                .map(card -> new CreditCardDto(
                        card.getId(),
                        card.getLabel(),
                        card.getNumber(),
                        card.getHolderName(),
                        card.getExpirationDate()
                ))
                .collect(Collectors.toList());
    }
}
