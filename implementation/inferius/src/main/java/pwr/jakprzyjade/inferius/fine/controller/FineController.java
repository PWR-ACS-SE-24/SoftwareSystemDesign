package pwr.jakprzyjade.inferius.fine.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pwr.jakprzyjade.inferius.fine.database.FineCreateDto;
import pwr.jakprzyjade.inferius.fine.database.FineDto;
import pwr.jakprzyjade.inferius.fine.service.FineService;
import pwr.jakprzyjade.inferius.shared.UUIDv7Validator;
import pwr.jakprzyjade.inferius.shared.UserRole;
import pwr.jakprzyjade.inferius.shared.UserRoles;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ext/v1/fines")
@Tag(name = "Fines", description = "Operations related to fines")
public class FineController {

    private final FineService fineService;
    private final UUIDv7Validator uuiDv7Validator;

    @UserRoles({UserRole.PASSENGER, UserRole.INSPECTOR})
    @GetMapping
    @Operation(summary = "Retrieve list of fines", description = "Pobranie listy mandatów.")
    public ResponseEntity<Page<FineDto>> getFines(
            @RequestHeader("jp-user-id") UUID userId,
            Pageable pageable
    ) {
        Page<FineDto> fines = fineService.getFines(userId, pageable);
        return ResponseEntity.ok(fines);
    }

    @UserRoles(UserRole.PASSENGER)
    @GetMapping("/{id}")
    @Operation(summary = "Retrieve fine details", description = "Pobranie informacji o mandacie.")
    public ResponseEntity<FineDto> getFineDetails(
            @RequestHeader("jp-user-id") UUID userId,
            @PathVariable("id") UUID fineId
    ) {
        FineDto fine = fineService.getFineDetails(userId, fineId);
        return ResponseEntity.ok(fine);
    }

    @UserRoles(UserRole.INSPECTOR)
    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a fine", description = "Anulowanie mandatu.")
    public ResponseEntity<FineDto> cancelFine(
            @RequestHeader("jp-user-id") UUID inspectorId,
            @PathVariable("id") String id
    ) {
        if (!uuiDv7Validator.isStringValidUUID(id)) {
            throw new IllegalArgumentException("Invalid fineId format. It must be a valid UUIDv7.");
        }

        UUID fineId = UUID.fromString(id);

        FineDto cancelledFine = fineService.cancelFine(inspectorId, fineId);
        return ResponseEntity.ok(cancelledFine);
    }

    @UserRoles(UserRole.INSPECTOR)
    @PostMapping
    @Operation(summary = "Issue a fine", description = "Wystawienie mandatu.")
    public ResponseEntity<FineDto> createFine(
            @RequestHeader("jp-user-id") UUID inspectorId,
            @Valid @RequestBody FineCreateDto fineCreateDto
    ) {
        FineDto createdFine = fineService.createFine(fineCreateDto, inspectorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFine);
    }
}
