package pwr.jakprzyjade.inferius.shared.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppError {
    private int code;
    private String kind;
    private String messageEn;
    private String messagePl;
}