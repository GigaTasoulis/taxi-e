"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingStats } from "@/components/reports/booking-stats"

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Αναφορές & Στατιστικά</h1>
      </div>

      <div className="grid gap-6">
        <BookingStats />
      </div>
    </div>
  )
}

