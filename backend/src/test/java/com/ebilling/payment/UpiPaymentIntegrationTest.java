package com.ebilling.payment;

import com.ebilling.configs.DevPaymentSeed;
import com.ebilling.models.auth.User;
import com.ebilling.models.payment.Account;
import com.ebilling.models.payment.Upi;
import com.ebilling.repositories.auth.UserRepository;
import com.ebilling.repositories.payment.AccountRepository;
import com.ebilling.repositories.payment.UpiRepository;
import com.ebilling.services.payment.UpiService;
import com.ebilling.utils.EncryptionUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UpiPaymentIntegrationTest {

    @Autowired
    private UpiRepository upiRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UpiService upiService;

    @Value("${app.encryption.key}")
    private String encryptionKey;

    @Value("${app.billing.receiver-upi-id}")
    private String receiverUpiId;

    @BeforeEach
    void seedWallet () throws Exception {
        String suffix = String.valueOf (System.nanoTime ());
        User user = new User ();
        user.setEmail ("wallet-test-" + suffix + "@localhost");
        user.setFirstName ("Wallet");
        user.setLastName ("Test");
        user.setPhoneNumber ("9999999999");
        user.setAdmin (false); // isAdmin
        user = userRepository.saveAndFlush (user);

        Account account = new Account ();
        account.setUser (user);
        account.setAccountNo (EncryptionUtil.encrypt ("6000000001", encryptionKey));
        account.setBankName ("Test Bank");
        account.setIfsc ("TEST0000001");
        account.setBalance (50_000.0);
        accountRepository.save (account);

        Upi sender = new Upi ();
        sender.setAccount (account);
        sender.setUpiId (EncryptionUtil.encrypt (DevPaymentSeed.DEV_SENDER_UPI_ID, encryptionKey));
        sender.setPin (EncryptionUtil.encrypt (DevPaymentSeed.DEV_SENDER_PIN, encryptionKey));
        upiRepository.save (sender);

        User receiverUser = new User ();
        receiverUser.setEmail ("receiver-" + suffix + "@localhost");
        receiverUser.setFirstName ("Receiver");
        receiverUser.setLastName ("Test");
        receiverUser.setPhoneNumber ("9999999998");
        receiverUser.setAdmin (true);
        receiverUser = userRepository.saveAndFlush (receiverUser);

        Account receiverAccount = new Account ();
        receiverAccount.setUser (receiverUser);
        receiverAccount.setAccountNo (EncryptionUtil.encrypt ("6000000002", encryptionKey));
        receiverAccount.setBankName ("Test Bank");
        receiverAccount.setIfsc ("TEST0000002");
        receiverAccount.setBalance (0.0);
        accountRepository.save (receiverAccount);

        Upi receiver = new Upi ();
        receiver.setAccount (receiverAccount);
        receiver.setUpiId (EncryptionUtil.encrypt (receiverUpiId.trim (), encryptionKey));
        receiver.setPin (EncryptionUtil.encrypt ("0000", encryptionKey));
        upiRepository.save (receiver);
    }

    @Test
    void repositoryFindsEncryptedUpiId () throws Exception {
        String encrypted = EncryptionUtil.encrypt (DevPaymentSeed.DEV_SENDER_UPI_ID, encryptionKey);
        Upi found = upiRepository.findByUpiId (encrypted);
        assertThat (found).isNotNull ();
    }

    @Test
    void payByUpiSucceedsForSeededWallets () {
        var transaction = upiService.payBillingInvoice (
                DevPaymentSeed.DEV_SENDER_UPI_ID,
                DevPaymentSeed.DEV_SENDER_PIN,
                100.0);
        assertThat (transaction).isNotNull ();
        assertThat (transaction.getAmount ()).isEqualTo (100.0);
    }
}
