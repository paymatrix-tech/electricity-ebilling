package com.ebilling.exceptions;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;

@Slf4j
public final class MailExceptionSupport {

    private static final String CLIENT_MESSAGE =
            "Email could not be sent. Please try again later or configure mail for this environment.";

    private MailExceptionSupport () {
    }

    public static String clientMessage () {
        return CLIENT_MESSAGE;
    }

    public static boolean isMailRelated (Throwable throwable) {
        if (throwable == null) {
            return false;
        }
        if (throwable instanceof MailException || throwable instanceof MessagingException) {
            return true;
        }
        return isMailRelated (throwable.getCause ());
    }

    public static String rootMessage (Throwable throwable) {
        Throwable root = throwable;
        while (root.getCause () != null && root.getCause () != root) {
            root = root.getCause ();
        }
        if (root.getMessage () != null && !root.getMessage ().isBlank ()) {
            return root.getMessage ();
        }
        return throwable.getMessage ();
    }

    public static void logDeliveryFailure (String to, String subject, Throwable throwable) {
        log.warn (
                "Could not deliver email to {} (subject: {}). {}. "
                        + "Set APP_MAIL_ENABLED=false for local dev or configure MAIL_HOST.",
                to != null ? to : "unknown",
                subject != null ? subject : "n/a",
                rootMessage (throwable));
        log.debug ("Mail delivery failure", throwable);
    }
}
