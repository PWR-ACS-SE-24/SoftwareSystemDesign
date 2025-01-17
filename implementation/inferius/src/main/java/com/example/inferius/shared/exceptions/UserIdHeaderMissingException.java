package com.example.inferius.shared.exceptions;

public class UserIdHeaderMissingException extends RuntimeException {
    public UserIdHeaderMissingException() {
        super("The header 'jp-user-id' is missing.");
    }
}
