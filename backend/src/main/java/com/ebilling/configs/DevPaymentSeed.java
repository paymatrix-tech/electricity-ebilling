package com.ebilling.configs;

import com.ebilling.models.auth.User;
import com.ebilling.models.payment.Account;
import com.ebilling.models.payment.Upi;
import com.ebilling.repositories.auth.UserRepository;
import com.ebilling.repositories.payment.AccountRepository;
import com.ebilling.repositories.payment.UpiRepository;
import com.ebilling.utils.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Ensures dev UPI accounts exist for bill payment (Liquibase does not encrypt UPI fields).
 */
@Slf4j
@Component
@Profile("local")
@Order(1)
@RequiredArgsConstructor
public class DevPaymentSeed implements ApplicationRunner {

    public static final String DEV_SENDER_UPI_ID = "demo@upi";
    public static final String DEV_SENDER_PIN = "1234";
    private static final String DEV_SENDER_ACCOUNT_NO = "5000000001";
    private static final String DEV_RECEIVER_ACCOUNT_NO = "5000000002";

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final UpiRepository upiRepository;

    @Value("${app.encryption.key}")
    private String encryptionKey;

    @Value("${app.billing.receiver-upi-id}")
    private String receiverUpiId;

    @Override
    public void run (ApplicationArguments args) {
        if (!userRepository.existsById (DevSeedLoginHint.SEED_ADMIN_USER_ID)) {
            return;
        }
        ensureUpi (
                DevSeedLoginHint.SEED_ADMIN_USER_ID,
                DEV_RECEIVER_ACCOUNT_NO,
                receiverUpiId.trim (),
                "0000",
                0.0);
        ensureUpi (
                "USR1000002",
                DEV_SENDER_ACCOUNT_NO,
                DEV_SENDER_UPI_ID,
                DEV_SENDER_PIN,
                100_000.0);
    }

    private void ensureUpi (
            String userId,
            String plainAccountNo,
            String plainUpiId,
            String plainPin,
            double balance) {
        if (upiRepository.findByUpiId (encrypt (plainUpiId)) != null) {
            return;
        }
        User user = userRepository.findById (userId).orElse (null);
        if (user == null) {
            log.warn ("Dev UPI seed skipped: user {} not found", userId);
            return;
        }

        Account account = accountRepository.findByAccountNo (encrypt (plainAccountNo))
                .orElseGet (() -> {
                    Account newAccount = new Account ();
                    newAccount.setUser (user);
                    newAccount.setAccountNo (encrypt (plainAccountNo));
                    newAccount.setBankName ("Dev Bank");
                    newAccount.setIfsc ("DEVB0000001");
                    newAccount.setBalance (balance);
                    return accountRepository.save (newAccount);
                });

        if (account.getBalance () < balance) {
            account.setBalance (balance);
            accountRepository.save (account);
        }

        Upi upi = new Upi ();
        upi.setAccount (account);
        upi.setUpiId (encrypt (plainUpiId));
        upi.setPin (encrypt (plainPin));
        upiRepository.save (upi);
        log.info ("Dev UPI seeded: {} (user {})", plainUpiId, userId);
    }

    private String encrypt (String value) {
        try {
            return EncryptionUtil.encrypt (value, encryptionKey);
        } catch (Exception e) {
            throw new IllegalStateException ("Dev UPI seed encryption failed", e);
        }
    }
}
