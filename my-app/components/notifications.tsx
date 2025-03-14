"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { useStore } from "@/lib/store"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface Notification {
  id: string
  type: "booking_created" | "booking_updated" | "booking_cancelled"
  message: string
  timestamp: string
  read: boolean
  bookingId?: string
}

export function NotificationsPopover() {
  const { state } = useStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  // Generate notifications from bookings
  useEffect(() => {
    const newNotifications: Notification[] = []

    // Get notifications from localStorage or create empty array
    const savedNotifications =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("taxiAppNotifications") || "[]") : []

    // Check if we have new bookings that aren't in notifications
    state.bookings.forEach((booking) => {
      const existingNotification = savedNotifications.find(
        (n: Notification) => n.type === "booking_created" && n.bookingId === booking.id,
      )

      if (!existingNotification) {
        newNotifications.push({
          id: `notification_${Date.now()}_${booking.id}`,
          type: "booking_created",
          message: `Νέα κράτηση από ${booking.client.name} (${booking.origin} → ${booking.destination})`,
          timestamp: booking.createdAt,
          read: false,
          bookingId: booking.id,
        })
      }
    })

    // Combine existing and new notifications
    const combinedNotifications = [...savedNotifications, ...newNotifications]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20) // Keep only the 20 most recent notifications

    setNotifications(combinedNotifications)
    setUnreadCount(combinedNotifications.filter((n) => !n.read).length)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("taxiAppNotifications", JSON.stringify(combinedNotifications))
    }
  }, [state.bookings])

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))

    setNotifications(updatedNotifications)
    setUnreadCount(0)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("taxiAppNotifications", JSON.stringify(updatedNotifications))
    }
  }

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    )

    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.filter((n) => !n.read).length)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("taxiAppNotifications", JSON.stringify(updatedNotifications))
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-red-500 text-white border-none">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Ειδοποιήσεις</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Σήμανση όλων ως αναγνωσμένα
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">Δεν υπάρχουν ειδοποιήσεις</div>
        ) : (
          <ScrollArea className="h-80">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 ${notification.read ? "" : "bg-muted/50"}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      {notification.bookingId ? (
                        <Link
                          href={`/bookings/${notification.bookingId}`}
                          className="font-medium hover:underline"
                          onClick={() => {
                            markAsRead(notification.id)
                            setOpen(false)
                          }}
                        >
                          {notification.message}
                        </Link>
                      ) : (
                        <p className="font-medium">{notification.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(notification.timestamp)}</p>
                    </div>
                    {!notification.read && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Νέο</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}

