package pwr.jakprzyjade.inferius.fine.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pwr.jakprzyjade.inferius.fine.database.Fine;
import pwr.jakprzyjade.inferius.fine.database.FineDto;
import pwr.jakprzyjade.inferius.fine.database.FineRepository;
import pwr.jakprzyjade.inferius.shared.exceptions.ResourceNotFoundException;
import pwr.jakprzyjade.inferius.shared.exceptions.UserUnauthorizedException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FineService {

    private final FineRepository fineRepository;

    public Page<FineDto> getFines(UUID userId, Pageable pageable) {
        Page<Fine> fines = fineRepository.findByPassengerIdOrInspectorId(userId, userId, pageable);
        if (fines.isEmpty()) {
            throw new ResourceNotFoundException("No fines found for user ID: " + userId);
        }
        return fines.map(fine -> FineDto.builder()
                .id(fine.getId())
                .amountPln(fine.getAmountPln())
                .time(fine.getTime())
                .recipient(fine.getRecipient())
                .reason(fine.getReason())
                .status(fine.getStatus())
                .build());
    }

    public FineDto getFineDetails(UUID userId, UUID fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found for ID: " + fineId));

        if (!fine.getPassengerId().equals(userId)) {
            throw new UserUnauthorizedException("You are not authorized to view this fine.");
        }

        return FineDto.builder()
                .id(fine.getId())
                .amountPln(fine.getAmountPln())
                .time(fine.getTime())
                .recipient(fine.getRecipient())
                .reason(fine.getReason())
                .status(fine.getStatus())
                .build();
    }
}
