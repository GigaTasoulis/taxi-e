"use client"

import Link from "next/link"
import { NotificationsPopover } from "@/components/notifications"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand Name */}
        <Link href="/" className="text-xl font-bold">
          Taxi Manager
        </Link>

        {/* Right Side Elements */}
        <div className="flex items-center space-x-4">
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
