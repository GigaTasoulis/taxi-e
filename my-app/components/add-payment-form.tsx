"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import type { Payment } from "@/types"

const paymentFormSchema = z.object({
  amount: z.string().min(1, { message: "Παρακαλώ εισάγετε ποσό" }),
  type: z.enum(["salary", "bonus", "advance"], {
    required_error: "Παρακαλώ επιλέξτε τύπο πληρωμής",
  }),
  date: z.string().min(1, { message: "Παρακαλώ επιλέξτε ημερομηνία" }),
  reference: z.string().min(1, { message: "Παρακαλώ εισάγετε αριθμό αναφοράς" }),
  status: z.enum(["pending", "paid", "cancelled"], {
    required_error: "Παρακαλώ επιλέξτε κατάσταση",
  }),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

interface AddPaymentFormProps {
  driverId: string
  onSave: (payment: Omit<Payment, "id">) => void
  onCancel: () => void
}

export function AddPaymentForm({ driverId, onSave, onCancel }: AddPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: "",
      type: "salary",
      date: new Date().toISOString().split("T")[0],
      reference: `ΠΛΗ${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(5, "0")}`,
      status: "pending",
    },
  })

  function onSubmit(data: PaymentFormValues) {
    setIsSubmitting(true)

    const newPayment: Omit<Payment, "id"> = {
      driverId,
      amount: Number.parseFloat(data.amount),
      type: data.type,
      date: data.date,
      reference: data.reference,
      status: data.status,
    }

    onSave(newPayment)
    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ποσό</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Εισάγετε ποσό" {...field} />
                </FormControl>
                <FormDescription>Ποσό σε ευρώ (€)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τύπος Πληρωμής</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Επιλέξτε τύπο πληρωμής" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="salary">Μισθός</SelectItem>
                    <SelectItem value="bonus">Μπόνους</SelectItem>
                    <SelectItem value="advance">Προκαταβολή</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ημερομηνία</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Αριθμός Αναφοράς</FormLabel>
                <FormControl>
                  <Input placeholder="Εισάγετε αριθμό αναφοράς" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κατάσταση</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Επιλέξτε κατάσταση" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Σε αναμονή</SelectItem>
                    <SelectItem value="paid">Πληρώθηκε</SelectItem>
                    <SelectItem value="cancelled">Ακυρώθηκε</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Ακύρωση
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Αποθήκευση..." : "Αποθήκευση"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

