package com.example.inferius.shared.exceptions;

import lombok.Getter;

@Getter
public class UserIdHeaderNotValidException extends RuntimeException {
    private final String messagePl;

    public UserIdHeaderNotValidException(String messageEn, String messagePl) {
        super(messageEn);
        this.messagePl = messagePl;
    }
}
