/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.getbyid;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.Request;
import pwr.jakprzyjade.clabbert.application.abstractions.users.UserData;

@Data
@Builder
@AllArgsConstructor
public class GetTicketByIdReq implements Request<GetTicketByIdRes> {
    private UUID id;
    private UUID requestUuid;
    private UserData userData;
}
