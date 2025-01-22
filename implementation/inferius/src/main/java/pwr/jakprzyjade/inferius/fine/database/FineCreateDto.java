package pwr.jakprzyjade.inferius.fine.database;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FineCreateDto {

    private UUID passengerId;

    @NotNull
    @Size(min = 1, max = 255)
    private String recipient;

    @NotNull
    @Min(0)
    private BigDecimal amountPln;

    @NotNull
    private FineReason reason;
}
