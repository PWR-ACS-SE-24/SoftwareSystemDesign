/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.controllers.external.v1;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
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
import org.springframework.web.bind.annotation.*;
import pwr.jakprzyjade.clabbert.api.annotations.UserRoles;
import pwr.jakprzyjade.clabbert.api.contracts.ErrorDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.CreateTicketOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.LongTermOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.SingleFareOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.TicketOfferDto;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.TimeLimitedOfferDto;
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
@Tag(name = "Ticket Offers", description = "Operations related to ticket offers management.")
public class TicketOffersController {

    private final Mediator mediator;
    private final TicketOfferMapper ticketOfferMapper;

    @Operation(
            summary = "Retrieve all ticket offers",
            description =
                    "Retrieves a list of all ticket offers, which may include single fare,"
                            + " time-limited, and long-term offers.",
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "List of all ticket offers",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        array =
                                                @ArraySchema(
                                                        schema =
                                                                @Schema(
                                                                        oneOf = {
                                                                            SingleFareOfferDto
                                                                                    .class,
                                                                            TimeLimitedOfferDto
                                                                                    .class,
                                                                            LongTermOfferDto.class
                                                                        },
                                                                        description =
                                                                                "A list of ticket"
                                                                                    + " offers."
                                                                                    + " Each offer"
                                                                                    + " is one of"
                                                                                    + " the types:"
                                                                                    + " SingleFareOfferDto,"
                                                                                    + " TimeLimitedOfferDto,"
                                                                                    + " LongTermOfferDto.")))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid request or missing headers",
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
    @UserRoles({UserRole.ADMIN, UserRole.PASSENGER})
    public ResponseEntity<List<TicketOfferDto>> getAllTicketOffers() throws AppException {
        final var request = new GetAllTicketOfferReq();
        final var result = mediator.send(request);
        final var resultDto =
                result.getTicketOffers().stream().map(ticketOfferMapper::toDto).toList();

        return ResponseEntity.ok(resultDto);
    }

    @Operation(
            summary = "Retrieve a ticket offer by ID",
            parameters = {
                @Parameter(
                        name = "id",
                        description = "UUID of the ticket offer",
                        example = "123e4567-e89b-12d3-a456-426614174000",
                        required = true)
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Ticket offer details",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        oneOf = {
                                                            SingleFareOfferDto.class,
                                                            TimeLimitedOfferDto.class,
                                                            LongTermOfferDto.class
                                                        }))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid path parameters or missing headers",
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
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Ticket offer not found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class)))
            })
    @GetMapping("/{id}")
    @UserRoles({UserRole.ADMIN, UserRole.PASSENGER})
    public ResponseEntity<TicketOfferDto> getTicketOfferById(
            @PathVariable("id") @ValidUUID String id) throws AppException {
        final var request = new GetTicketOfferByIdReq(UUID.fromString(id));
        final var result = mediator.send(request);
        final var resultDto = ticketOfferMapper.toDto(result.getTicketOffer());

        return ResponseEntity.ok(resultDto);
    }

    @Operation(
            summary = "Create a new ticket offer",
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Ticket offer created successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        oneOf = {
                                                            SingleFareOfferDto.class,
                                                            TimeLimitedOfferDto.class,
                                                            LongTermOfferDto.class
                                                        }))),
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
    @PostMapping
    @UserRoles({UserRole.ADMIN})
    public ResponseEntity<TicketOfferDto> createTicketOffer(
            @Valid @RequestBody CreateTicketOfferDto dto) throws AppException {
        final var request = ticketOfferMapper.toReq(dto);
        final var result = mediator.send(request);
        final var resultDto = ticketOfferMapper.toDto(result.getTicketOffer());

        return ResponseEntity.ok(resultDto);
    }

    @Operation(
            summary = "Update an existing ticket offer by inactivating it and creating a new one",
            parameters = {
                @Parameter(
                        name = "id",
                        description = "UUID of the ticket offer to update",
                        example = "123e4567-e89b-12d3-a456-426614174000",
                        required = true)
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Ticket offer updated successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        oneOf = {
                                                            SingleFareOfferDto.class,
                                                            TimeLimitedOfferDto.class,
                                                            LongTermOfferDto.class
                                                        }))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid request data, path parameters, or missing headers",
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
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Ticket offer not found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class)))
            })
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

    @Operation(
            summary = "Delete a ticket offer by inactivating it",
            parameters = {
                @Parameter(
                        name = "id",
                        description = "UUID of the ticket offer to delete",
                        example = "123e4567-e89b-12d3-a456-426614174000",
                        required = true)
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Ticket offer deleted successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema =
                                                @Schema(
                                                        oneOf = {
                                                            SingleFareOfferDto.class,
                                                            TimeLimitedOfferDto.class,
                                                            LongTermOfferDto.class
                                                        }))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid path parameters or missing headers",
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
                                        schema = @Schema(implementation = ErrorDto.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Ticket offer not found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ErrorDto.class)))
            })
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
