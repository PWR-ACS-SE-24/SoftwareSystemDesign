/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.api.contracts.ticket;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.jakprzyjade.clabbert.api.contracts.ticketoffer.TicketOfferDto;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(
        description =
                "Represents the details of a ticket, including its ID, purchase time, associated"
                        + " ticket offer, validation data, and ticket status.")
public class TicketDto {

    @Schema(
            description = "The unique identifier for the ticket, typically in UUID format.",
            example = "6c49b6c0-ef21-11e9-bd6e-2a2ae2dbc9b7",
            required = true)
    private String id;

    @Schema(
            description =
                    "The timestamp when the ticket was purchased, represented as an ISO-8601"
                            + " instant timestamp.",
            example = "2025-01-23T15:30:00Z",
            required = true)
    private Instant purchaseTime;

    @Schema(
            description =
                    "The ticket offer associated with this ticket, which includes the specific"
                            + " details of the ticket's offer.",
            required = true)
    private TicketOfferDto offer;

    @Schema(
            description =
                    "The validation data for the ticket, including validation time and vehicle side"
                            + " number if applicable.",
            required = false)
    private ValidationDto validation;

    @Schema(
            description =
                    "The current status of the ticket, such as ACTIVE, INACTIVE, NOT-VALIDATED,"
                            + " CANCELLED, or PENDING.",
            example = "ACTIVE",
            required = true,
            allowableValues = {"ACTIVE", "INACTIVE", "NOT-VALIDATED", "CANCELLED", "PENDING"})
    private String ticketStatus;
}
