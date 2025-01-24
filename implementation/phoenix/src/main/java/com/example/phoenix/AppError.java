package com.example.phoenix;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppError {
    private int code;
    private String kind;
    private String messageEn;
    private String messagePl;
}
