package com.example.inferius.wallet.controller;

import com.example.inferius.shared.exceptions.UserRole;
import com.example.inferius.shared.exceptions.UserRoles;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

