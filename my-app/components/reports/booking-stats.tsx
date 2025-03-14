"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export function BookingStats() {
  const { state } = useStore()
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")

  // Get bookings for the selected time range
  const getFilteredBookings = () => {
    const now = new Date()
    let cutoffDate: Date

    switch (timeRange) {
      case "week":
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        break
      case "month":
        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case "year":
        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
    }

    return state.bookings.filter((booking) => new Date(booking.createdAt) >= cutoffDate)
  }

  const filteredBookings = getFilteredBookings()

  // Prepare data for booking type chart
  const bookingTypeData = [
    { name: "Άφιξη", value: filteredBookings.filter((b) => b.bookingType === "arrival").length },
    { name: "Αναχώρηση", value: filteredBookings.filter((b) => b.bookingType === "departure").length },
    { name: "Μεταφορά", value: filteredBookings.filter((b) => b.bookingType === "transfer").length },
  ]

  // Prepare data for booking status chart
  const bookingStatusData = [
    { name: "Σε αναμονή", value: filteredBookings.filter((b) => b.status === "pending").length },
    { name: "Επιβεβαιωμένη", value: filteredBookings.filter((b) => b.status === "confirmed").length },
    { name: "Ολοκληρωμένη", value: filteredBookings.filter((b) => b.status === "completed").length },
    { name: "Ακυρωμένη", value: filteredBookings.filter((b) => b.status === "cancelled").length },
  ]

  // Prepare data for bookings by day chart
  const getBookingsByDay = () => {
    const days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 12
    const format = timeRange === "year" ? "month" : "day"
    const result = []

    for (let i = 0; i < days; i++) {
      const date = new Date()
      if (format === "day") {
        date.setDate(date.getDate() - i)
        const dayStr = date.toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit" })

        const count = filteredBookings.filter((booking) => {
          const bookingDate = new Date(booking.createdAt)
          return (
            bookingDate.getDate() === date.getDate() &&
            bookingDate.getMonth() === date.getMonth() &&
            bookingDate.getFullYear() === date.getFullYear()
          )
        }).length

        result.unshift({ name: dayStr, count })
      } else {
        date.setMonth(date.getMonth() - i)
        const monthStr = date.toLocaleDateString("el-GR", { month: "short" })

        const count = filteredBookings.filter((booking) => {
          const bookingDate = new Date(booking.createdAt)
          return bookingDate.getMonth() === date.getMonth() && bookingDate.getFullYear() === date.getFullYear()
        }).length

        result.unshift({ name: monthStr, count })
      }
    }

    return result
  }

  const bookingsByDay = getBookingsByDay()

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Στατιστικά Κρατήσεων</CardTitle>
            <CardDescription>Ανάλυση κρατήσεων και τάσεις</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(value: "week" | "month" | "year") => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Επιλέξτε χρονικό διάστημα" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Τελευταία εβδομάδα</SelectItem>
              <SelectItem value="month">Τελευταίος μήνας</SelectItem>
              <SelectItem value="year">Τελευταίο έτος</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Επισκόπηση</TabsTrigger>
            <TabsTrigger value="types">Τύποι Κρατήσεων</TabsTrigger>
            <TabsTrigger value="status">Κατάσταση Κρατήσεων</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} κρατήσεις`, "Αριθμός"]}
                    labelFormatter={(label) => `Ημερομηνία: ${label}`}
                  />
                  <Bar dataKey="count" name="Κρατήσεις" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Συνολικές κρατήσεις: {filteredBookings.length} για την επιλεγμένη περίοδο
            </div>
          </TabsContent>

          <TabsContent value="types" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} κρατήσεις`, "Αριθμός"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="status" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} κρατήσεις`, "Αριθμός"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

