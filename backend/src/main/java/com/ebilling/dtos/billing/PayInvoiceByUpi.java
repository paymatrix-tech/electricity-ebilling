package com.ebilling.dtos.billing;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayInvoiceByUpi {
    private String invoiceId;
    private String senderUpiId;
    private String senderPin;
}
