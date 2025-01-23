/* @jakubzehner (C) 2025 */
package pwr.jakprzyjade.clabbert.application.modules.ticket.validate;

import java.time.Clock;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwr.jakprzyjade.clabbert.application.abstractions.internalservices.lepreachaun.LeprechaunService;
import pwr.jakprzyjade.clabbert.application.abstractions.mediator.RequestHandler;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.TicketRepository;
import pwr.jakprzyjade.clabbert.application.abstractions.repositories.ValidationRepository;
import pwr.jakprzyjade.clabbert.domain.entities.Validation;
import pwr.jakprzyjade.clabbert.domain.exceptions.AppException;
import pwr.jakprzyjade.clabbert.domain.exceptions.ticket.TicketAlreadyValidatedException;
import pwr.jakprzyjade.clabbert.domain.exceptions.ticket.TicketNotFoundException;

@Service
@RequiredArgsConstructor
public class ValidateTicketHandler implements RequestHandler<ValidateTicketReq, ValidateTicketRes> {
    private final TicketRepository ticketRepository;
    private final ValidationRepository validationRepository;
    private final LeprechaunService leprechaunService;
    private final Clock clock;

    @Override
    @Transactional
    public ValidateTicketRes handle(ValidateTicketReq request) throws AppException {
        var ticket =
                ticketRepository
                        .findById(request.getId())
                        .filter(t -> t.getPassengerId().equals(request.getUserData().getId()))
                        .orElseThrow(TicketNotFoundException::new);

        if (ticket.getValidation() != null) {
            throw new TicketAlreadyValidatedException();
        }

        final var routeId =
                UUID.fromString(
                        leprechaunService
                                .getRouteIdFromVehicleSideNumber(
                                        request.getVehicleSideNumber(), request.getRequestUuid())
                                .getId());

        var validation =
                Validation.builder()
                        .routeId(routeId)
                        .time(clock.instant())
                        .vehicleSideNumber(request.getVehicleSideNumber())
                        .build();
        validation = validationRepository.save(validation);

        ticket.setValidation(validation);
        validation = ticketRepository.save(ticket).getValidation();

        return new ValidateTicketRes(validation);
    }
}
