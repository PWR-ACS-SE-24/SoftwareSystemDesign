/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.controllers.external.v1;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pwr.jakprzyjade.clabbert.api.annotations.UserRoles;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.CreateTicketOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.TicketOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.UpdateTicketOfferDto;
import pwr.jakprzyjade.clabbert.api.mappers.TicketOfferMapper;
import pwr.jakprzyjade.clabbert.api.validators.annotations.ValidUUID;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Mediator;
import pwr.jakprzyjade.clabbert.application.abstractions.users.UserRole;
import pwr.jakprzyjade.clabbert.application.modules.ticketoffer.deletebyid.DeleteTicketOfferByIdReq;
import pwr.jakprzyjade.clabbert.application.modules.ticketoffer.getall.GetAllTicketOfferReq;
import pwr.jakprzyjade.clabbert.application.modules.ticketoffer.getbyid.GetTicketOfferByIdReq;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@RestController
@RequestMapping("/ext/v1/offers")
@RequiredArgsConstructor
@Validated
public class TicketOffersController {

    private final Mediator mediator;
    private final TicketOfferMapper ticketOfferMapper;

    @GetMapping
    @UserRoles({UserRole.ADMIN, UserRole.PASSENGER})
    public ResponseEntity<List<TicketOfferDto>> getAllTicketOffers() throws AppException {

        final var request = new GetAllTicketOfferReq();
        final var result = mediator.send(request);
        final var resultDto =
                result.getTicketOffers().stream().map(ticketOfferMapper::toDto).toList();

        return ResponseEntity.ok(resultDto);
    }

    @GetMapping("/{id}")
    @UserRoles({UserRole.ADMIN, UserRole.PASSENGER})
    public ResponseEntity<TicketOfferDto> getTicketOfferById(
            @PathVariable("id") @ValidUUID String id) throws AppException {

        final var request = new GetTicketOfferByIdReq(UUID.fromString(id));
        final var result = mediator.send(request);
        final var resultDto = ticketOfferMapper.toDto(result.getTicketOffer());

        return ResponseEntity.ok(resultDto);
    }

    @PostMapping
    @UserRoles({UserRole.ADMIN})
    public ResponseEntity<TicketOfferDto> createTicketOffer(
            @Valid @RequestBody CreateTicketOfferDto dto) throws AppException {

        final var request = ticketOfferMapper.toReq(dto);
        final var result = mediator.send(request);
        final var resultDto = ticketOfferMapper.toDto(result.getTicketOffer());

        return ResponseEntity.ok(resultDto);
    }

    @PatchMapping("/{id}")
    @UserRoles({UserRole.ADMIN})
    public ResponseEntity<TicketOfferDto> updateTicketOffer(
            @PathVariable("id") @ValidUUID String id, @Valid @RequestBody UpdateTicketOfferDto dto)
            throws AppException {

        var request = ticketOfferMapper.toReq(dto);
        request.setId(UUID.fromString(id));
        final var result = mediator.send(request);
        final var resultDto = ticketOfferMapper.toDto(result.getTicketOffer());

        return ResponseEntity.ok(resultDto);
    }

    @DeleteMapping("/{id}")
    @UserRoles({UserRole.ADMIN})
    public ResponseEntity<TicketOfferDto> deleteTicketOffer(
            @PathVariable("id") @ValidUUID String id) throws AppException {

        var request = new DeleteTicketOfferByIdReq(UUID.fromString(id));
        var result = mediator.send(request);
        var resultDto = ticketOfferMapper.toDto(result.getTicketOffer());

        return ResponseEntity.ok(resultDto);
    }
}
