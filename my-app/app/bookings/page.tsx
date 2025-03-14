"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore } from "@/lib/store"

export default function BookingsPage() {
  const router = useRouter()
  const { state } = useStore()
  const { bookings, drivers } = state

  const [searchTerm, setSearchTerm] = useState("")

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.bookingCode && booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Get driver name by ID
  const getDriverName = (driverId?: string) => {
    if (!driverId) return "Μη ανατεθειμένο"
    const driver = drivers.find((d) => d.id === driverId)
    return driver ? `${driver.name} ${driver.surname}` : "Άγνωστος"
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Κρατήσεις</h1>
        </div>
        <Link href="/bookings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Νέα Κράτηση
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Διαχείριση Κρατήσεων</CardTitle>
          <CardDescription>Προβολή και διαχείριση όλων των κρατήσεων ταξί</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Αναζήτηση κρατήσεων..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Αριθμός Κράτησης</TableHead>
                  <TableHead>Πελάτης</TableHead>
                  <TableHead>Διαδρομή</TableHead>
                  <TableHead>Ημερομηνία & Ώρα</TableHead>
                  <TableHead>Οδηγός</TableHead>
                  <TableHead>Κατάσταση</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/bookings/${booking.id}`)}
                  >
                    <TableCell>#{booking.id}</TableCell>
                    <TableCell>{booking.client.name}</TableCell>
                    <TableCell>
                      {booking.origin} → {booking.destination}
                    </TableCell>
                    <TableCell>
                      {booking.pickupDate}, {booking.departureTime}
                    </TableCell>
                    <TableCell>{getDriverName(booking.driverId)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full 
                        ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Επιβεβαιωμένη"
                          : booking.status === "pending"
                            ? "Σε αναμονή"
                            : booking.status === "cancelled"
                              ? "Ακυρωμένη"
                              : "Ολοκληρωμένη"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

