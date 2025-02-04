package pwr.jakprzyjade.inferius.wallet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pwr.jakprzyjade.inferius.shared.exceptions.ResourceNotFoundException;
import pwr.jakprzyjade.inferius.wallet.database.*;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletHistoryRepository walletHistoryRepository;

    public WalletDto getWallet(UUID passengerId) {
        Wallet wallet = walletRepository.findByPassengerId(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for passenger ID: " + passengerId));

        return WalletDto.builder()
                .id(wallet.getId())
                .balance(wallet.getBalancePln())
                .build();
    }

    public Page<WalletHistoryDto> getWalletHistory(UUID passengerId, Pageable pageable) {
        Wallet wallet = walletRepository.findByPassengerId(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for passenger ID: " + passengerId));

        return walletHistoryRepository.findByWalletId(wallet.getId(), pageable)
                .map(history -> WalletHistoryDto.builder()
                        .id(history.getId())
                        .amount(history.getAmountPln())
                        .time(history.getTime())
                        .build());
    }
}
