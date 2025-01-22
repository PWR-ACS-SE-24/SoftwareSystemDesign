package pwr.jakprzyjade.inferius.fine.controller;

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
import pwr.jakprzyjade.inferius.fine.database.FineDto;
import pwr.jakprzyjade.inferius.fine.service.FineService;
import pwr.jakprzyjade.inferius.shared.exceptions.UserRole;
import pwr.jakprzyjade.inferius.shared.exceptions.UserRoles;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ext/v1/fines")
@Tag(name = "Fines", description = "Operations related to fines")
public class FineController {

    private final FineService fineService;

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
}
