"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Hotel, Users, BarChart } from "lucide-react"
import { useStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import { el } from "date-fns/locale"

export default function HomePage() {
  const { state } = useStore()
  const { bookings, hotels, drivers } = state

  // Get confirmed bookings count
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length

  // Get active hotels (those with recent logins)
  const activeHotels = hotels.length

  // Get active drivers
  const activeDrivers = drivers.length

  // Get recent bookings, sorted by creation date
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Calculate booking growth percentage
  const bookingGrowth = "+14%" // In a real app, this would be calculated from historical data

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Σύστημα Διαχείρισης Ταξί</h1>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Πίνακας Ελέγχου</TabsTrigger>
          <TabsTrigger value="bookings">Κρατήσεις</TabsTrigger>
          <TabsTrigger value="management">Διαχείριση</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/bookings">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Συνολικές Κρατήσεις</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">{bookingGrowth} από τον προηγούμενο μήνα</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/hotels">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ενεργά Ξενοδοχεία</CardTitle>
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeHotels}</div>
                  <p className="text-xs text-muted-foreground">+{Math.floor(activeHotels * 0.1)} νέα αυτό το μήνα</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/drivers">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ενεργοί Οδηγοί</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeDrivers}</div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(activeDrivers * 0.1)} από τον προηγούμενο μήνα
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/reports">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Αναφορές</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Προβολή</div>
                  <p className="text-xs text-muted-foreground">Στατιστικά & αναφορές</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Πρόσφατες Κρατήσεις</CardTitle>
                <CardDescription>Τελευταίες κρατήσεις ταξί από όλα τα ξενοδοχεία</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentBookings.map((booking) => {
                    const timeAgo = formatDistanceToNow(new Date(booking.createdAt), {
                      addSuffix: true,
                      locale: el,
                    })

                    const totalPassengers =
                      booking.passengers.adults + booking.passengers.children + booking.passengers.infants

                    return (
                      <div key={booking.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <Link href={`/bookings/${booking.id}`} className="font-medium hover:underline">
                            Κράτηση #{booking.id}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {booking.origin} → {booking.destination}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{timeAgo}</p>
                          <p className="text-xs text-muted-foreground">
                            {totalPassengers} επιβάτ{totalPassengers === 1 ? "ης" : "ες"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Γρήγορες Ενέργειες</CardTitle>
                <CardDescription>Συνήθεις εργασίες και λειτουργίες</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link href="/bookings/new">
                  <Button className="w-full">Νέα Κράτηση</Button>
                </Link>
                <Link href="/hotels">
                  <Button variant="outline" className="w-full">
                    Διαχείριση Ξενοδοχείων
                  </Button>
                </Link>
                <Link href="/drivers">
                  <Button variant="outline" className="w-full">
                    Διαχείριση Οδηγών
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button variant="outline" className="w-full">
                    Αναφορές & Στατιστικά
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Διαχείριση Κρατήσεων</CardTitle>
              <CardDescription>Δημιουργία και διαχείριση κρατήσεων ταξί</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Πρόσφατες Κρατήσεις</h3>
                <Link href="/bookings/new">
                  <Button>Νέα Κράτηση</Button>
                </Link>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 font-medium border-b">
                  <div>Αριθμός Κράτησης</div>
                  <div>Πελάτης</div>
                  <div>Διαδρομή</div>
                  <div>Ημερομηνία & Ώρα</div>
                  <div>Κατάσταση</div>
                </div>
                {bookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.id}`}
                    className="grid grid-cols-5 p-4 border-b hover:bg-muted/50"
                  >
                    <div>#{booking.id}</div>
                    <div>{booking.client.name}</div>
                    <div>
                      {booking.origin} → {booking.destination}
                    </div>
                    <div>
                      {booking.pickupDate}, {booking.departureTime}
                    </div>
                    <div>
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
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Διαχείριση Ξενοδοχείων</CardTitle>
                <CardDescription>Διαχείριση πληροφοριών και ρυθμίσεων ξενοδοχείων</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/hotels">
                  <Button className="w-full">Προβολή Ξενοδοχείων</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Διαχείριση Οδηγών</CardTitle>
                <CardDescription>Διαχείριση πληροφοριών και αναθέσεων οδηγών</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/drivers">
                  <Button className="w-full">Προβολή Οδηγών</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

