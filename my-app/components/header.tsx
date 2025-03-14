"use client"

import Link from "next/link"
import { NotificationsPopover } from "@/components/notifications"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Taxi Manager
        </Link>
        <div className="flex items-center gap-4">
          <NotificationsPopover />
          <ModeToggle />
          <Button asChild>
            <Link href="/bookings/new">Νέα Κράτηση</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

