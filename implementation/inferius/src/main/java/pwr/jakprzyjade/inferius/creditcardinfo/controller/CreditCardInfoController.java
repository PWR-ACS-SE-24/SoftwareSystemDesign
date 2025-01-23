package pwr.jakprzyjade.inferius.creditcardinfo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pwr.jakprzyjade.inferius.creditcardinfo.database.CreditCardDto;
import pwr.jakprzyjade.inferius.creditcardinfo.database.UpdateCreditCardDto;
import pwr.jakprzyjade.inferius.creditcardinfo.service.CreditCardInfoService;
import pwr.jakprzyjade.inferius.shared.UUIDv7Validator;
import pwr.jakprzyjade.inferius.shared.UserRole;
import pwr.jakprzyjade.inferius.shared.UserRoles;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ext/v1/cards")
@RequiredArgsConstructor
@Tag(name = "Credit Card", description = "Operations related to credit cards")
public class CreditCardInfoController {

    private final CreditCardInfoService creditCardInfoService;
    private final UUIDv7Validator uuiDv7Validator;

    @UserRoles(UserRole.PASSENGER)
    @GetMapping
    @Operation(summary = "Retrieve credit cards", description = "Pobranie listy kart płatniczych.")
    public ResponseEntity<List<CreditCardDto>> getCreditCards(
            @RequestHeader("jp-user-id") UUID userId
    ) {
        List<CreditCardDto> cards = creditCardInfoService.getCreditCards(userId);
        return ResponseEntity.ok(cards);
    }

    @UserRoles(UserRole.PASSENGER)
    @PutMapping("/{id}")
    @Operation(summary = "Update credit card", description = "Zaktualizowanie danych karty płatniczej.")
    public ResponseEntity<CreditCardDto> updateCreditCard(
            @RequestHeader("jp-user-id") UUID userId,
            @PathVariable("id") String id,
            @Valid @RequestBody UpdateCreditCardDto updateDto
    ) {
        if (!uuiDv7Validator.isStringValidUUID(id)) {
            throw new IllegalArgumentException("Invalid cardId format. It must be a valid UUIDv7.");
        }

        UUID cardId = UUID.fromString(id);

        CreditCardDto updatedCard = creditCardInfoService.updateCreditCard(cardId, updateDto, userId);
        return ResponseEntity.ok(updatedCard);
    }

    @UserRoles(UserRole.PASSENGER)
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete credit card", description = "Usunięcie karty płatniczej.")
    public ResponseEntity<Void> deleteCreditCard(
            @RequestHeader("jp-user-id") UUID userId,
            @PathVariable("id") String id
    ) {
        if (!uuiDv7Validator.isStringValidUUID(id)) {
            throw new IllegalArgumentException("Invalid cardId format. It must be a valid UUIDv7.");
        }

        UUID cardId = UUID.fromString(id);
        creditCardInfoService.deleteCreditCard(cardId, userId);
        return ResponseEntity.noContent().build();
    }
}
