"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import type { Booking } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditBookingForm } from "@/components/edit-booking-form"
import { AssignDriverForm } from "@/components/assign-driver-form"
import { toast } from "@/hooks/use-toast"

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { state, updateBooking, deleteBooking } = useStore()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAssignDriverOpen, setIsAssignDriverOpen] = useState(false)

  const bookingId = params.id as string

  useEffect(() => {
    const foundBooking = state.bookings.find((b) => b.id === bookingId)
    if (foundBooking) {
      setBooking(foundBooking)
    } else {
      // Booking not found, redirect to home
      router.push("/")
    }
  }, [bookingId, state.bookings, router])

  if (!booking) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-lg text-muted-foreground">Φόρτωση κράτησης...</p>
        </div>
      </div>
    )
  }

  const handleStatusChange = (newStatus: Booking["status"]) => {
    updateBooking(bookingId, { status: newStatus })
    setBooking({ ...booking, status: newStatus })
  }

  const handleDeleteBooking = () => {
    deleteBooking(bookingId)
    router.push("/")
  }

  const handleAssignDriver = (driverId: string) => {
    updateBooking(bookingId, { driverId })
    setBooking({ ...booking, driverId })
    setIsAssignDriverOpen(false)

    toast({
      title: "Επιτυχία!",
      description: "Ο οδηγός ανατέθηκε με επιτυχία.",
      variant: "success",
    })
  }

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Επιβεβαιωμένη</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Σε αναμονή</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Ολοκληρωμένη</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Ακυρωμένη</Badge>
    }
  }

  const totalPassengers = booking.passengers.adults + booking.passengers.children + booking.passengers.infants

  const assignedDriver = booking.driverId ? state.drivers.find((d) => d.id === booking.driverId) : null

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Λεπτομέρειες Κράτησης</h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Επεξεργασία
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Επεξεργασία Κράτησης</DialogTitle>
                <DialogDescription>
                  Τροποποιήστε τα στοιχεία της κράτησης και πατήστε αποθήκευση όταν τελειώσετε.
                </DialogDescription>
              </DialogHeader>
              <EditBookingForm
                booking={booking}
                onSave={(updatedBooking) => {
                  updateBooking(bookingId, updatedBooking)
                  setBooking({ ...booking, ...updatedBooking })
                  setIsEditDialogOpen(false)
                }}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Διαγραφή
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Διαγραφή Κράτησης</AlertDialogTitle>
                <AlertDialogDescription>
                  Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την κράτηση; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteBooking}>Διαγραφή</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Κράτηση #{booking.id}</CardTitle>
                  <CardDescription>
                    Δημιουργήθηκε στις {new Date(booking.createdAt).toLocaleString("el-GR")}
                  </CardDescription>
                </div>
                <div>{getStatusBadge(booking.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Τύπος Κράτησης</h3>
                  <p className="font-medium">
                    {booking.bookingType === "arrival"
                      ? "Άφιξη"
                      : booking.bookingType === "departure"
                        ? "Αναχώρηση"
                        : "Μεταφορά"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Κατάσταση</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={booking.status === "pending" ? "border-yellow-500" : ""}
                      onClick={() => handleStatusChange("pending")}
                    >
                      Σε αναμονή
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={booking.status === "confirmed" ? "border-green-500" : ""}
                      onClick={() => handleStatusChange("confirmed")}
                    >
                      Επιβεβαιωμένη
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={booking.status === "completed" ? "border-blue-500" : ""}
                      onClick={() => handleStatusChange("completed")}
                    >
                      Ολοκληρωμένη
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={booking.status === "cancelled" ? "border-red-500" : ""}
                      onClick={() => handleStatusChange("cancelled")}
                    >
                      Ακυρωμένη
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Στοιχεία Διαδρομής</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Αφετηρία</h4>
                      <p className="text-muted-foreground">{booking.origin}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Προορισμός</h4>
                      <p className="text-muted-foreground">{booking.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Ημερομηνία</h4>
                      <p className="text-muted-foreground">{booking.pickupDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Ώρα Αναχώρησης</h4>
                      <p className="text-muted-foreground">{booking.departureTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Επιβάτες</h4>
                      <p className="text-muted-foreground">
                        {totalPassengers} συνολικά ({booking.passengers.adults} ενήλικες
                        {booking.passengers.children > 0 ? `, ${booking.passengers.children} παιδιά` : ""}
                        {booking.passengers.infants > 0 ? `, ${booking.passengers.infants} βρέφη` : ""})
                      </p>
                    </div>
                  </div>
                </div>

                {(booking.roomNumber || booking.flightNumber || booking.flightTime) && (
                  <div className="grid gap-4 md:grid-cols-3">
                    {booking.roomNumber && (
                      <div>
                        <h4 className="font-medium">Αριθμός Δωματίου</h4>
                        <p className="text-muted-foreground">{booking.roomNumber}</p>
                      </div>
                    )}

                    {booking.flightNumber && (
                      <div>
                        <h4 className="font-medium">Αριθμός Πτήσης</h4>
                        <p className="text-muted-foreground">{booking.flightNumber}</p>
                      </div>
                    )}

                    {booking.flightTime && (
                      <div>
                        <h4 className="font-medium">Ώρα Πτήσης</h4>
                        <p className="text-muted-foreground">{booking.flightTime}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Στοιχεία Πληρωμής</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Τρόπος Πληρωμής</h4>
                      <p className="text-muted-foreground">
                        {booking.paymentOption === "client"
                          ? "Απευθείας από τον Πελάτη"
                          : booking.paymentOption === "accounting"
                            ? "Λογιστήριο"
                            : "Δωρεάν"}
                      </p>
                    </div>
                  </div>

                  {booking.voucherNumber && (
                    <div>
                      <h4 className="font-medium">Αριθμός Voucher</h4>
                      <p className="text-muted-foreground">{booking.voucherNumber}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {booking.displaySign ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p>{booking.displaySign ? "Εμφάνιση πινακίδας με το όνομα του πελάτη" : "Χωρίς πινακίδα"}</p>
                </div>
              </div>

              {booking.comments && (
                <>
                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Σχόλια</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{booking.comments}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Στοιχεία Πελάτη</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Ονοματεπώνυμο</h3>
                <p className="text-muted-foreground">
                  {booking.client.title === "mr"
                    ? "κ. "
                    : booking.client.title === "mrs"
                      ? "κα. "
                      : booking.client.title === "ms"
                        ? "δις. "
                        : "Δρ. "}
                  {booking.client.name}
                </p>
              </div>

              {booking.client.idNumber && (
                <div>
                  <h3 className="font-medium">ΑΔΤ</h3>
                  <p className="text-muted-foreground">{booking.client.idNumber}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium">Εθνικότητα</h3>
                <p className="text-muted-foreground">{booking.client.nationality}</p>
              </div>

              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">{booking.client.email}</p>
              </div>

              <div>
                <h3 className="font-medium">Τηλέφωνο</h3>
                <p className="text-muted-foreground">{booking.client.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Γρήγορες Ενέργειες</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant={booking.status === "confirmed" ? "default" : "outline"}
                onClick={() => handleStatusChange("confirmed")}
                disabled={booking.status === "confirmed"}
              >
                Επιβεβαίωση Κράτησης
              </Button>

              <Button
                className="w-full"
                variant={booking.status === "completed" ? "default" : "outline"}
                onClick={() => handleStatusChange("completed")}
                disabled={booking.status === "completed"}
              >
                Ολοκλήρωση Κράτησης
              </Button>

              <Button
                className="w-full"
                variant="destructive"
                onClick={() => handleStatusChange("cancelled")}
                disabled={booking.status === "cancelled"}
              >
                Ακύρωση Κράτησης
              </Button>

              <Button className="w-full" variant="outline" onClick={() => setIsAssignDriverOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                {assignedDriver ? "Αλλαγή Οδηγού" : "Ανάθεση σε Οδηγό"}
              </Button>
            </CardContent>
          </Card>

          {assignedDriver && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Ανατεθειμένος Οδηγός</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-medium">Ονοματεπώνυμο</h3>
                    <p className="text-muted-foreground">
                      {assignedDriver.name} {assignedDriver.surname}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">ΑΦΜ</h3>
                    <p className="text-muted-foreground">{assignedDriver.taxId}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Ολοκληρωμένες Διαδρομές</h3>
                    <p className="text-muted-foreground">{assignedDriver.routesCompleted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isAssignDriverOpen} onOpenChange={setIsAssignDriverOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ανάθεση Οδηγού</DialogTitle>
            <DialogDescription>Επιλέξτε οδηγό για την κράτηση #{booking.id}</DialogDescription>
          </DialogHeader>
          <AssignDriverForm
            drivers={state.drivers}
            currentDriverId={booking.driverId}
            onSave={handleAssignDriver}
            onCancel={() => setIsAssignDriverOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

