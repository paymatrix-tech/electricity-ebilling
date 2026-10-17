package com.ebilling.services.payment;

import com.ebilling.constants.PaymentType;
import com.ebilling.constants.TransactPaymentStatus;
import com.ebilling.constants.TransactionType;
import com.ebilling.dtos.payment.UpiRequest;
import com.ebilling.dtos.payment.UpiResponse;
import com.ebilling.exceptions.BadRequestException;
import com.ebilling.models.payment.Account;
import com.ebilling.models.payment.Transaction;
import com.ebilling.models.payment.Upi;
import com.ebilling.repositories.payment.AccountRepository;
import com.ebilling.repositories.payment.TransactionRepository;
import com.ebilling.repositories.payment.UpiRepository;
import com.ebilling.services.notification.EmailService;
import com.ebilling.utils.EncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UpiService {

    @Autowired
    private UpiRepository upiRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountService accountService;

    @Autowired
    private EmailService emailService;

    @Value("${app.encryption.key}")
    private String encryptionKey;

    @Value("${app.billing.receiver-upi-id}")
    private String billingReceiverUpiId;

    // Method to create a new UPI ID from UpiRequest
    public UpiResponse createUpi (UpiRequest upiRequest) {
        Optional<Account> optionalAccount = accountRepository.findByAccountNo (encrypt (upiRequest.getAccountNo ()));

        if (optionalAccount.isEmpty ()) {
            throw new BadRequestException ("Account not found with account number: " + upiRequest.getAccountNo ());
        }


        Upi upi = new Upi ();
        upi.setAccount (optionalAccount.get ());
        upi.setUpiId (encrypt (upiRequest.getUpiId ()));
        upi.setPin (encrypt (upiRequest.getPin ()));
        upiRepository.save (upi);
        return UpiResponse.builder ()
                .id (upi.getId ())
                .upiId (upi.getUpiId ())
                .balance (optionalAccount.get ().getBalance ())
                .accountNo (optionalAccount.get ().getAccountNo ())
                .build ();
    }

    public UpiResponse getUpiById (String id) {
        Optional<Upi> optionalUpi = upiRepository.findById (id);
        if (optionalUpi.isEmpty ()) {
            throw new BadRequestException ("Upi not found with ID: " + id);
        }
        Upi upi = optionalUpi.get ();
        return UpiResponse.builder ()
                .id (upi.getId ())
                .upiId (decrypt (upi.getUpiId ()))
                .balance (upi.getAccount ().getBalance ())
                .accountNo (decrypt (upi.getAccount ().getAccountNo ()))
                .build ();
    }

    public Transaction payBillingInvoice (String senderUpiId, String senderPin, double amount) {
        return payByUPI (senderUpiId, billingReceiverUpiId.trim (), senderPin, amount);
    }

    public Transaction payByUPI (String senderUpiId, String receiverUpiId, String senderPin, double amount) {
        senderUpiId = normalize (senderUpiId, "Sender UPI ID");
        receiverUpiId = normalize (receiverUpiId, "Receiver UPI ID");
        senderPin = normalize (senderPin, "UPI PIN");

        String encryptSenderUpiId = encrypt (senderUpiId);
        String encryptedReceiverUpiId = encrypt (receiverUpiId);

        Upi senderUpi = upiRepository.findByUpiId (encryptSenderUpiId);
        Upi receiverUpi = upiRepository.findByUpiId (encryptedReceiverUpiId);

        if (senderUpi == null || receiverUpi == null) {
            throw new BadRequestException ("Invalid UPI IDs provided.");
        }

        // Validate sender's UPI PIN
        if (!senderUpi.getPin ().equals (encrypt (senderPin))) {
            throw new BadRequestException ("Incorrect UPI PIN.");
        }

        Account senderAccount = senderUpi.getAccount ();
        Account receiverAccount = receiverUpi.getAccount ();

        // Check sender's balance
        if (senderAccount.getBalance () < amount) {
            throw new BadRequestException ("Insufficient balance.");
        }

        // Debit sender's account
        senderAccount.setBalance (senderAccount.getBalance () - amount);

        // Credit receiver's account
        receiverAccount.setBalance (receiverAccount.getBalance () + amount);

        // Create and save the transaction
        Transaction transaction = new Transaction ();
        transaction.setSenderAccountId (senderAccount.getId ());
        transaction.setReceiverAccountId (receiverAccount.getId ());
        transaction.setAmount (amount);
        transaction.setType (TransactionType.DEBIT);
        transaction.setPaymentType (PaymentType.UPI);
        transaction.setStatus (TransactPaymentStatus.SUCCESS); // Update status as SUCCESS

        transactionRepository.save (transaction);

        // Update accounts
        accountRepository.save (senderAccount);
        accountRepository.save (receiverAccount);


        String senderMessage = "Dear " + senderAccount.getUser ().getFirstName () + ",\n\n"
                + "Your UPI transaction of Rs. " + amount + " to UPI ID: " + receiverUpiId + " has been successfully processed. "
                + "Your updated account balance is Rs. " + senderAccount.getBalance () + ".\n\n"
                + "Thank you for using our service.";

        String receiverMessage = "Dear " + receiverAccount.getUser ().getFirstName () + ",\n\n"
                + "You have received Rs. " + amount + " from UPI ID: " + senderUpiId + " via UPI. "
                + "Your updated account balance is Rs. " + receiverAccount.getBalance () + ".\n\n"
                + "Thank you for using our service.";

        emailService.sendEmail (senderAccount.getUser ().getEmail (),
                "UPI Transaction Successful",
                senderMessage,
                false); // Plain text email

        emailService.sendEmail (receiverAccount.getUser ().getEmail (),
                "UPI Transaction Received",
                receiverMessage,
                false); // Plain text email


        return transaction;
    }


    private static String normalize (String value, String label) {
        if (value == null || value.isBlank ()) {
            throw new BadRequestException (label + " is required.");
        }
        return value.trim ();
    }

    private String encrypt (String data) {
        try {
            return EncryptionUtil.encrypt (data, encryptionKey);
        } catch (Exception e) {
            throw new RuntimeException ("Encryption error", e);
        }
    }

    private String decrypt (String data) {
        try {
            return EncryptionUtil.decrypt (data, encryptionKey);
        } catch (Exception e) {
            throw new RuntimeException ("Decryption error", e);
        }
    }
}
