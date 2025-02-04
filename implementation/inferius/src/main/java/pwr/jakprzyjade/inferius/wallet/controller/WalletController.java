package pwr.jakprzyjade.inferius.wallet.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pwr.jakprzyjade.inferius.shared.UserRole;
import pwr.jakprzyjade.inferius.shared.UserRoles;
import pwr.jakprzyjade.inferius.wallet.database.WalletDto;
import pwr.jakprzyjade.inferius.wallet.database.WalletHistoryDto;
import pwr.jakprzyjade.inferius.wallet.service.WalletService;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ext/v1/wallet")
@Tag(name = "Wallet", description = "Operations related to wallet")
public class WalletController {

    private final WalletService walletService;

    @UserRoles(UserRole.PASSENGER)
    @GetMapping
    @Operation(summary = "Retrieve balance for wallet", description = "Pobranie stanu portfela.")
    public ResponseEntity<WalletDto> getWallet(@RequestHeader("jp-user-id") UUID passengerId) {
        WalletDto walletDto = walletService.getWallet(passengerId);
        return ResponseEntity.ok(walletDto);
    }

    @UserRoles(UserRole.PASSENGER)
    @GetMapping("/history")
    @Operation(summary = "Retrieve wallet transaction history", description = "Pobranie historii doładowań portfela.")
    public ResponseEntity<Page<WalletHistoryDto>> getWalletHistory(
            @RequestHeader("jp-user-id") UUID passengerId,
            Pageable pageable) {
        Page<WalletHistoryDto> history = walletService.getWalletHistory(passengerId, pageable);
        return ResponseEntity.ok(history);
    }
}
