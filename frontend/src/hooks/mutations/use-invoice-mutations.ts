import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInvoice, payInvoiceByUpi, uploadInvoicesCsv } from '../../api/invoiceApi'
import { queryKeys } from '../../api/query-keys'

export function useCreateInvoiceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
    },
  })
}

export function useUploadInvoicesCsvMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: uploadInvoicesCsv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
    },
  })
}

export function usePayInvoiceByUpiMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      invoiceId,
      senderUpiId,
      senderPin,
    }: {
      invoiceId: string
      senderUpiId: string
      senderPin: string
    }) => payInvoiceByUpi(invoiceId, senderUpiId, senderPin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
    },
  })
}
