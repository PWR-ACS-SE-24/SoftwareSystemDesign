/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticketoffer.deletebyid;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Request;

@Data
@Builder
@AllArgsConstructor
public class DeleteTicketOfferByIdReq implements Request<DeleteTicketOfferByIdRes> {
    private UUID id;
}
