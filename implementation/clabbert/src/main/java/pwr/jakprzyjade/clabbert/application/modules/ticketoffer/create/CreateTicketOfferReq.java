/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.create;

import java.math.BigDecimal;
import java.time.Duration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Request;
import pwr.jakprzyjade.clabbert.application.abstractions.ticketoffer.TicketOfferType;
import pwr.jakprzyjade.clabbert.domain.entities.TicketKind;

@Data
@Builder
@AllArgsConstructor
public class CreateTicketOfferReq implements Request<CreateTicketOfferRes> {
    private String displayNameEn;
    private String displayNamePl;
    private TicketKind kind;
    private BigDecimal pricePln;
    private TicketOfferType ticketOfferType;
    private Integer intervalInDays;
    private Duration duration;
}
