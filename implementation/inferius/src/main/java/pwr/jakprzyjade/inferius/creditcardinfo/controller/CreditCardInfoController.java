package pwr.jakprzyjade.inferius.creditcardinfo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pwr.jakprzyjade.inferius.creditcardinfo.database.CreditCardDto;
import pwr.jakprzyjade.inferius.creditcardinfo.service.CreditCardInfoService;
import pwr.jakprzyjade.inferius.shared.exceptions.UserRole;
import pwr.jakprzyjade.inferius.shared.exceptions.UserRoles;

import java.util.List;

@RestController
@RequestMapping("/ext/v1/cards")
@RequiredArgsConstructor
@Tag(name = "Credit Card", description = "Operations related to credit cards")
public class CreditCardInfoController {

    private final CreditCardInfoService creditCardInfoService;

    @UserRoles(UserRole.PASSENGER)
    @GetMapping
    @Operation(summary = "Retrieve credit cards", description = "Pobranie listy kart płatniczych.")
    public ResponseEntity<List<CreditCardDto>> getCreditCards(
            @RequestHeader("jp-user-id") String userId
    ) {
        List<CreditCardDto> cards = creditCardInfoService.getCreditCards(userId);
        return ResponseEntity.ok(cards);
    }
}
