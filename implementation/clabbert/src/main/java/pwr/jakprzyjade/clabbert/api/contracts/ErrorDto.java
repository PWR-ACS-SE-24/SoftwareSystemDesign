/* @jakubzehner (C) 2024 */
package pwr.jakprzyjade.clabbert.api.contracts;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ErrorDto {

    private final int code;
    private final String kind;
    private final String messageEn;
    private final String messagePl;
}
