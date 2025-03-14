"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import type { Booking } from "@/types"
import { DialogFooter } from "@/components/ui/dialog"

const bookingFormSchema = z.object({
  bookingType: z.enum(["arrival", "departure", "transfer"], {
    required_error: "Παρακαλώ επιλέξτε τύπο κράτησης",
  }),
  origin: z.string().min(2, { message: "Η αφετηρία πρέπει να έχει τουλάχιστον 2 χαρακτήρες" }),
  destination: z.string().min(2, { message: "Ο προορισμός πρέπει να έχει τουλάχιστον 2 χαρακτήρες" }),
  pickupDate: z.string().min(1, { message: "Παρακαλώ επιλέξτε ημερομηνία παραλαβής" }),
  departureTime: z.string().min(1, { message: "Παρακαλώ εισάγετε ώρα αναχώρησης" }),
  roomNumber: z.string().optional(),
  flightTime: z.string().optional(),
  flightNumber: z.string().optional(),
  adults: z.string().min(1, { message: "Παρακαλώ εισάγετε αριθμό ενηλίκων" }),
  children: z.string().default("0"),
  infants: z.string().default("0"),
  title: z.string().min(1, { message: "Παρακαλώ επιλέξτε προσφώνηση" }),
  clientName: z.string().min(2, { message: "Παρακαλώ εισάγετε το όνομα του πελάτη" }),
  idNumber: z.string().optional(),
  email: z.string().email({ message: "Παρακαλώ εισάγετε έγκυρη διεύθυνση email" }),
  phone: z.string().min(5, { message: "Παρακαλώ εισάγετε έγκυρο αριθμό τηλεφώνου" }),
  nationality: z.string().min(2, { message: "Παρακαλώ εισάγετε εθνικότητα" }),
  bookingCode: z.string().optional(),
  comments: z.string().optional(),
  paymentOption: z.enum(["client", "accounting", "complimentary"], {
    required_error: "Παρακαλώ επιλέξτε τρόπο πληρωμής",
  }),
  voucherNumber: z.string().optional(),
  displaySign: z.boolean().default(false),
})

type BookingFormValues = z.infer<typeof bookingFormSchema>

interface EditBookingFormProps {
  booking: Booking
  onSave: (updatedBooking: Partial<Booking>) => void
  onCancel: () => void
}

export function EditBookingForm({ booking, onSave, onCancel }: EditBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Convert booking to form values
  const defaultValues: BookingFormValues = {
    bookingType: booking.bookingType,
    origin: booking.origin,
    destination: booking.destination,
    pickupDate: booking.pickupDate,
    departureTime: booking.departureTime,
    roomNumber: booking.roomNumber || "",
    flightTime: booking.flightTime || "",
    flightNumber: booking.flightNumber || "",
    adults: booking.passengers.adults.toString(),
    children: booking.passengers.children.toString(),
    infants: booking.passengers.infants.toString(),
    title: booking.client.title,
    clientName: booking.client.name,
    idNumber: booking.client.idNumber || "",
    email: booking.client.email,
    phone: booking.client.phone,
    nationality: booking.client.nationality,
    bookingCode: booking.bookingCode || "",
    comments: booking.comments || "",
    paymentOption: booking.paymentOption,
    voucherNumber: booking.voucherNumber || "",
    displaySign: booking.displaySign,
  }

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  })

  function onSubmit(data: BookingFormValues) {
    setIsSubmitting(true)

    // Convert form data to booking object
    const updatedBooking: Partial<Booking> = {
      bookingType: data.bookingType,
      origin: data.origin,
      destination: data.destination,
      pickupDate: data.pickupDate,
      departureTime: data.departureTime,
      roomNumber: data.roomNumber,
      flightTime: data.flightTime,
      flightNumber: data.flightNumber,
      passengers: {
        adults: Number.parseInt(data.adults),
        children: Number.parseInt(data.children),
        infants: Number.parseInt(data.infants),
      },
      client: {
        title: data.title,
        name: data.clientName,
        idNumber: data.idNumber,
        email: data.email,
        phone: data.phone,
        nationality: data.nationality,
      },
      bookingCode: data.bookingCode,
      comments: data.comments,
      paymentOption: data.paymentOption,
      voucherNumber: data.voucherNumber,
      displaySign: data.displaySign,
    }

    // Save the updated booking
    onSave(updatedBooking)
    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="bookingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τύπος Κράτησης</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="arrival" />
                      </FormControl>
                      <FormLabel className="font-normal">Άφιξη</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="departure" />
                      </FormControl>
                      <FormLabel className="font-normal">Αναχώρηση</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="transfer" />
                      </FormControl>
                      <FormLabel className="font-normal">Μεταφορά</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Αφετηρία</FormLabel>
                  <FormControl>
                    <Input placeholder="Τοποθεσία παραλαβής" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Προορισμός</FormLabel>
                  <FormControl>
                    <Input placeholder="Τοποθεσία άφιξης" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="pickupDate"
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
              name="departureTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ώρα Αναχώρησης</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Αριθμός Δωματίου</FormLabel>
                  <FormControl>
                    <Input placeholder="Προαιρετικό" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="flightTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ώρα Πτήσης (τοπική ώρα)</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="Προαιρετικό" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="flightNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Αριθμός Πτήσης</FormLabel>
                  <FormControl>
                    <Input placeholder="Προαιρετικό" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="adults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ενήλικες</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormDescription>Ηλικία 12+</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="children"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Παιδιά</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormDescription>Ηλικία 2-12 ετών</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="infants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Βρέφη</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormDescription>Ηλικία 0-2 ετών</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Προσφώνηση</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε προσφώνηση" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mr">κ.</SelectItem>
                      <SelectItem value="mrs">κα.</SelectItem>
                      <SelectItem value="ms">δις.</SelectItem>
                      <SelectItem value="dr">Δρ.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Όνομα Πελάτη</FormLabel>
                  <FormControl>
                    <Input placeholder="Πλήρες όνομα" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ΑΔΤ</FormLabel>
                  <FormControl>
                    <Input placeholder="Προαιρετικό" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Εθνικότητα</FormLabel>
                  <FormControl>
                    <Input placeholder="Χώρα καταγωγής" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="client@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Τηλέφωνο</FormLabel>
                  <FormControl>
                    <Input placeholder="+30 210 1234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bookingCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κωδικός Κράτησης</FormLabel>
                <FormControl>
                  <Input placeholder="Προαιρετικός κωδικός αναφοράς" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επιπλέον Σχόλια</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ειδικές απαιτήσεις ή πληροφορίες"
                    className="min-h-[100px]"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="paymentOption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επιλογή Πληρωμής</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Επιλέξτε τρόπο πληρωμής" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="client">Απευθείας από τον Πελάτη</SelectItem>
                    <SelectItem value="accounting">Λογιστήριο</SelectItem>
                    <SelectItem value="complimentary">Δωρεάν</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voucherNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Αριθμός Voucher</FormLabel>
                <FormControl>
                  <Input placeholder="Αριθμός αναφοράς" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displaySign"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Εμφάνιση Πινακίδας</FormLabel>
                  <FormDescription>
                    Εμφάνιση πινακίδας με το λογότυπο του ξενοδοχείου και το όνομα του πελάτη
                  </FormDescription>
                </div>
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

