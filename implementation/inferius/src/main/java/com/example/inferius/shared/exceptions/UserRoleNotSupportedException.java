package com.example.inferius.shared.exceptions;

public class UserRoleNotSupportedException extends RuntimeException {
    public UserRoleNotSupportedException() {
        super("The role in 'jp-user-role' is not supported.");
    }
}
