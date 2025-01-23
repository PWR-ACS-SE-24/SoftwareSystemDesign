/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.inspect;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Request;
import pwr.jakprzyjade.clabbert.application.abstractions.users.UserData;

@Data
@Builder
@AllArgsConstructor
public class InspectTicketReq implements Request<InspectTicketRes> {
    private UUID id;
    private UUID requestUuid;
    private UserData userData;
    private String vehicleSideNumber;
}
