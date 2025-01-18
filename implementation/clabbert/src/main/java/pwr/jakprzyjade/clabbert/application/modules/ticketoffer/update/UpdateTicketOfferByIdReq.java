/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.update;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Request;
import pwr.jakprzyjade.clabbert.application.abstractions.ticketoffer.TicketOfferKind;
import pwr.jakprzyjade.clabbert.domain.entities.TicketKind;

@Data
@Builder
@AllArgsConstructor
public class UpdateTicketOfferByIdReq implements Request<UpdateTicketOfferByIdRes> {
    private UUID id;
    private String displayNameEn;
    private String displayNamePl;
    private TicketKind kind;
    private BigDecimal pricePln;
    private TicketOfferKind ticketOfferKind;
    private Integer intervalInDays;
    private Duration duration;
}
