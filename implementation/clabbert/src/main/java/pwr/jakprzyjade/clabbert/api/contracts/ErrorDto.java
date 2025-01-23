/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.contracts;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(
        description =
                "Represents an error response, including an error code, type, and localized"
                        + " messages.")
public class ErrorDto {

    @Schema(
            description =
                    "The error code, typically an HTTP status code or custom application error"
                            + " code.",
            example = "404",
            required = true)
    private final int code;

    @Schema(
            description =
                    "The kind of error, typically a unique identifier or short string describing"
                            + " the error.",
            example = "ticket-not-found",
            required = true)
    private final String kind;

    @Schema(
            description =
                    "The error message in English, providing a detailed description of the error.",
            example = "Ticket not found.",
            required = true)
    private final String messageEn;

    @Schema(
            description =
                    "The error message in Polish, providing a localized description of the error.",
            example = "Nie znaleziono biletu.",
            required = true)
    private final String messagePl;
}
