/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.controllers.external.v1;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pwr.jakprzyjade.clabbert.api.annotations.UserRoles;
import pwr.jakprzyjade.clabbert.api.contracts.ErrorDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticket.CreateTicketDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticket.InspectTicketDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticket.InspectionDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticket.TicketDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticket.ValidateTicketDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticket.ValidationDto;
import pwr.jakprzyjade.clabbert.api.mappers.InspectionMapper;
import pwr.jakprzyjade.clabbert.api.mappers.TicketMapper;
import pwr.jakprzyjade.clabbert.api.mappers.ValidationMapper;
import pwr.jakprzyjade.clabbert.api.validators.annotations.ValidUUID;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Mediator;
import pwr.jakprzyjade.clabbert.application.abstractions.users.UserData;
import pwr.jakprzyjade.clabbert.application.abstractions.users.UserRole;
import pwr.jakprzyjade.clabbert.application.modules.ticket.create.CreateTicketReq;
import pwr.jakprzyjade.clabbert.application.modules.ticket.getall.GetAllTicketReq;
import pwr.jakprzyjade.clabbert.application.modules.ticket.getbyid.GetTicketByIdReq;
import pwr.jakprzyjade.clabbert.application.modules.ticket.inspect.InspectTicketReq;
import pwr.jakprzyjade.clabbert.application.modules.ticket.validate.ValidateTicketReq;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;

@RestController
@RequestMapping("/ext/v1/tickets")
@RequiredArgsConstructor
@Validated
@Tag(name = "Tickets", description = "Operations related to ticket management.")
public class TicketsController {
    private final Mediator mediator;
    private final TicketMapper ticketMapper;
    private final ValidationMapper validationMapper;
    private final InspectionMapper inspectionMapper;

    @Operation(
            summary = "Retrieve all tickets",
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "List of tickets",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = TicketDto[].class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid request data or missing headers",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized access",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class)))
            })
    @GetMapping
    @UserRoles({UserRole.PASSENGER})
    public ResponseEntity<List<TicketDto>> getAllTickets(
            @RequestAttribute("userData") UserData userData,
            @RequestAttribute("jp-request-id") UUID requestUuid)
            throws AppException {

        final var request =
                GetAllTicketReq.builder().requestUuid(requestUuid).userData(userData).build();
        final var result = mediator.send(request);
        final var resultDto =
                result.getTicketsWithActive().stream().map(ticketMapper::toDto).toList();

        return ResponseEntity.ok(resultDto);
    }

    @Operation(
            summary = "Retrieve a ticket by ID",
            parameters = {
                @Parameter(
                        name = "id",
                        description = "UUID of the ticket",
                        example = "123e4567-e89b-12d3-a456-426614174000",
                        required = true)
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Ticket details",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = TicketDto.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid path parameters or missing headers",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Ticket not found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized access",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class)))
            })
    @GetMapping("/{id}")
    @UserRoles({UserRole.PASSENGER})
    public ResponseEntity<TicketDto> getTicketById(
            @RequestAttribute("userData") UserData userData,
            @RequestAttribute("jp-request-id") UUID requestUuid,
            @PathVariable("id") @ValidUUID String id)
            throws AppException {

        final var request =
                GetTicketByIdReq.builder()
                        .id(UUID.fromString(id))
                        .requestUuid(requestUuid)
                        .userData(userData)
                        .build();
        final var result = mediator.send(request);
        final var resultDto = ticketMapper.toDto(result.getTicketWithActive());

        return ResponseEntity.ok(resultDto);
    }

    @Operation(
            summary = "Create a new ticket",
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Ticket created successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = TicketDto.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid request data or missing headers",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Ticket offer not found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "User account cannot be charged",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized access",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class)))
            })
    @PostMapping
    @UserRoles({UserRole.PASSENGER})
    public ResponseEntity<TicketDto> createTicket(
            @Valid @RequestBody CreateTicketDto dto,
            @RequestAttribute("userData") UserData userData,
            @RequestAttribute("jp-request-id") UUID requestUuid)
            throws AppException {

        final var request =
                CreateTicketReq.builder()
                        .userData(userData)
                        .requestUuid(requestUuid)
                        .offerId(UUID.fromString(dto.getOfferId()))
                        .build();
        final var result = mediator.send(request);
        final var resultDto = ticketMapper.toDto(result.getTicketWithActive());

        return ResponseEntity.ok(resultDto);
    }

    @Operation(
            summary = "Validate a ticket",
            parameters = {
                @Parameter(
                        name = "id",
                        description = "UUID of the ticket",
                        example = "123e4567-e89b-12d3-a456-426614174000",
                        required = true)
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Ticket validated successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ValidationDto.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Ticket already validated",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Ticket or vehicle not found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized access",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class)))
            })
    @PostMapping("/{id}/validate")
    @UserRoles({UserRole.PASSENGER})
    public ResponseEntity<ValidationDto> validateTicket(
            @RequestAttribute("userData") UserData userData,
            @RequestAttribute("jp-request-id") UUID requestUuid,
            @PathVariable("id") @ValidUUID String id,
            @Valid @RequestBody ValidateTicketDto dto)
            throws AppException {

        final var request =
                ValidateTicketReq.builder()
                        .id(UUID.fromString(id))
                        .userData(userData)
                        .requestUuid(requestUuid)
                        .vehicleSideNumber(dto.getVehicleSideNumber())
                        .build();
        final var result = mediator.send(request);
        final var resultDto = validationMapper.toDto(result.getValidation());

        return ResponseEntity.ok(resultDto);
    }

    @Operation(
            summary = "Inspect a ticket",
            parameters = {
                @Parameter(
                        name = "id",
                        description = "UUID of the ticket",
                        example = "123e4567-e89b-12d3-a456-426614174000",
                        required = true)
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Ticket inspected successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = InspectionDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Vehicle not found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "401",
                        description = "Unauthorized access",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class)))
            })
    @PostMapping("/{id}/inspect")
    @UserRoles({UserRole.INSPECTOR})
    public ResponseEntity<InspectionDto> inspectTicket(
            @RequestAttribute("userData") UserData userData,
            @RequestAttribute("jp-request-id") UUID requestUuid,
            @PathVariable("id") @ValidUUID String id,
            @Valid @RequestBody InspectTicketDto dto)
            throws AppException {

        final var request =
                InspectTicketReq.builder()
                        .id(UUID.fromString(id))
                        .userData(userData)
                        .requestUuid(requestUuid)
                        .vehicleSideNumber(dto.getVehicleSideNumber())
                        .build();
        final var result = mediator.send(request);
        final var resultDto = inspectionMapper.toDto(result.getInspection());

        return ResponseEntity.ok(resultDto);
    }
}
