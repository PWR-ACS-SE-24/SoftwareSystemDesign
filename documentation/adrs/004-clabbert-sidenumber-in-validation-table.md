---
scope: Clabbert
date: 2025-01-22
deciders: "@jakubzehner"
informed: "@tchojnacki, @mlodybercik, @piterek130"
---

# Adding vehicle side number to Validation table for single fare ticket verification in Clabbert

## Context and Problem Statement

The Clabbert service has an issue verifying whether a single fare ticket is active because it lacks information about the vehicle in which the ticket was purchased (it only knows the route ID) or when the route ends. Without this information, the service cannot ensure proper status of single fare tickets.

## Considered Options

- Asking passengers for the vehicle number every time
- Hardcoding a fixed validity time for single fare tickets
- Adding the vehicle side number (vehicle identifier) to the `Validation` table
- Adding the route end time to the `Validation` table

## Decision Outcome

Chosen option: **Adding the vehicle side number to the `Validation` table**, because it allows checking whether a specific vehicle is still on the same route on which the passenger purchased the ticket. This ensures proper ticket status without requiring additional passenger input or hardcoding assumptions.

The following changes will be made:

- Add a `vehicleSideNumber` field to the `Validation` table in Clabbert database.
- Update the checking ticket status logic to include checks against the vehicle number.

### Consequences

- Good, because validation data becomes more accurate by linking tickets to specific vehicles.
- Good, because the system remains flexible and avoids hardcoding assumptions about ticket validity.
- Good, because the change is scalable and aligns with existing microservice architecture principles.
- Bad, because it increases the dependency on the Leprechaun microservice.
- Bad, because it diverges from the documentation from the previous development phase.
