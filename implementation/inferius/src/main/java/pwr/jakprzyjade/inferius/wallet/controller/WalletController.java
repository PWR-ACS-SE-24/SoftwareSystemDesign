package pwr.jakprzyjade.inferius.wallet.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pwr.jakprzyjade.inferius.shared.exceptions.UserRole;
import pwr.jakprzyjade.inferius.shared.exceptions.UserRoles;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import pwr.jakprzyjade.inferius.wallet.database.Wallet;

@Validated
@RestController
@RequestMapping("/ext/v1/wallets")
@Tag(name = "Wallets", description = "Operacje na portfelach użytkowników")
public class WalletController {

    @UserRoles(UserRole.PASSENGER)
    @GetMapping("/wallet")
    @Operation(summary = "Pobierz listę portfeli", description = "Zwraca listę wszystkich portfeli")
    public String getAllWallets() {
        return "Lista portfeli";
    }

    @PostMapping
    public ResponseEntity<String> testValidation(@RequestBody @Valid Wallet wallet) {
        return ResponseEntity.ok("Validation passed");
    }
}

