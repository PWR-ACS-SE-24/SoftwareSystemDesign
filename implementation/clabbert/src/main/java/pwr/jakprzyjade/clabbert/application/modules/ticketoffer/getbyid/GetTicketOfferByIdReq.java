/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.getbyid;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Request;

@Data
@Builder
@AllArgsConstructor
public class GetTicketOfferByIdReq implements Request<GetTicketOfferByIdRes> {
    private UUID id;
}
