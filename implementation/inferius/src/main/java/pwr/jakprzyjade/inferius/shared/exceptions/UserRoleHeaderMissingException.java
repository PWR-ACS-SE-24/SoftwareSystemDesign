package pwr.jakprzyjade.inferius.shared.exceptions;

public class UserRoleHeaderMissingException extends RuntimeException {
    public UserRoleHeaderMissingException() {
        super("The header 'jp-user-role' is missing.");
    }
}
