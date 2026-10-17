package com.ebilling.services.notification;

import com.ebilling.dtos.billing.InvoiceResponse;
import com.ebilling.utils.PdfGenerationUtility;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.constraints.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private PdfGenerationUtility pdfGenerationUtility;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Async("emailTaskExecutor")
    public void sendEmail (@Email String to, String subject, String body, boolean isHtml) {
        if (!mailEnabled) {
            logSkipped (to, subject, body);
            return;
        }
        deliverEmail (to, subject, body, isHtml);
        log.info ("Email sent successfully to: {} — subject: {}", to, subject);
    }

    @Async("fileLoadingTaskExecutor")
    public void sendOtpEmail (String to, String otp) {
        if (!mailEnabled) {
            log.warn ("OTP for {} (mail disabled): {}", to, otp);
            return;
        }

        String subject = "Verify Your Login";
        log.info ("Sending OTP email to: {}", to);
        String body = getCachedTemplate ().replace ("{{otp}}", otp);
        deliverEmail (to, subject, body, true);
        log.info ("OTP email sent successfully to: {}", to);
    }

    @Async("emailTaskExecutor")
    public void sendInvoiceEmail (InvoiceResponse invoice) {
        if (!mailEnabled) {
            log.info ("Mail disabled; skipped invoice email to {}", invoice.getCustomerEmail ());
            return;
        }

        try {
            byte[] pdfBytes = pdfGenerationUtility.generateInvoicePdf (invoice);

            MimeMessage message = javaMailSender.createMimeMessage ();
            MimeMessageHelper helper = new MimeMessageHelper (message, true);

            helper.setTo (invoice.getCustomerEmail ());
            String subject = String.format ("Electricity Bill - %s",
                    invoice.getMonth ().format (DateTimeFormatter.ofPattern ("MMMM yyyy")));
            helper.setSubject (subject);
            helper.setText (createEmailBody (invoice), false);

            String fileName = String.format ("electricity_bill_%s.pdf",
                    invoice.getMonth ().format (DateTimeFormatter.ofPattern ("MMM_yyyy")));
            helper.addAttachment (fileName, new ByteArrayResource (pdfBytes));

            javaMailSender.send (message);
            log.info ("Invoice email sent successfully to: {}", invoice.getCustomerEmail ());
        } catch (MessagingException e) {
            throw new MailSendException ("Failed to compose invoice email", e);
        } catch (Exception e) {
            log.error ("Failed to send invoice email for {}: {}", invoice.getCustomerEmail (), e.getMessage ());
            log.debug ("Invoice email failed", e);
        }
    }

    private void deliverEmail (String to, String subject, String body, boolean isHtml) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage ();
            MimeMessageHelper helper = new MimeMessageHelper (message, true);
            helper.setTo (to);
            helper.setSubject (subject);
            helper.setText (body, isHtml);
            javaMailSender.send (message);
        } catch (MessagingException e) {
            throw new MailSendException ("Failed to compose email", e);
        }
    }

    private void logSkipped (String to, String subject, String body) {
        log.info ("Mail disabled (app.mail.enabled=false); skipped message to {} — subject: {}", to, subject);
        log.debug ("Skipped email body to {}:\n{}", to, body);
    }

    private String createEmailBody (InvoiceResponse invoice) {
        return String.format ("""
                        Dear %s,
                        
                        Your electricity bill for %s is attached to this email.
                        
                        Bill Summary:
                        - Bill Amount: ₹%.2f
                        - Due Date: %s
                        - Units Consumed: %d
                        
                        Please ensure payment by the due date to avoid any service interruption.
                        
                        If you have any questions about your bill, please contact our customer support.
                        
                        Thank you for your business.
                        
                        Best regards,
                        Electricity eBilling Team
                        """,
                invoice.getCustomerName (),
                invoice.getMonth ().format (DateTimeFormatter.ofPattern ("MMMM yyyy")),
                invoice.getFinalAmount (),
                invoice.getDueDate ().format (DateTimeFormatter.ofPattern ("dd MMMM yyyy")),
                invoice.getUnits ()
        );
    }


    @Cacheable("emailTemplateCache")
    private String getCachedTemplate () {
        try {
            ClassPathResource resource = new ClassPathResource ("templates/otp_verification_email_template.html");
            return new String (FileCopyUtils.copyToByteArray (resource.getInputStream ()), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error ("Error loading email template from classpath. Current classpath: {}", System.getProperty ("java.class.path"), e);
            return "";
        }
    }
}
