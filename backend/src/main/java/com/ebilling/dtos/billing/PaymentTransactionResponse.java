package com.ebilling.dtos.billing;

import com.ebilling.constants.InvoiceTransactionStatus;
import com.ebilling.constants.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTransactionResponse {

    private String id;
    private String invoiceId;
    private String customerId;
    private LocalDateTime paymentDate;
    private Double paymentAmount;
    private PaymentType paymentType;
    private InvoiceTransactionStatus paymentStatus;
}
