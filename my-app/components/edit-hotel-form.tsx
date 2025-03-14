"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import type { Hotel } from "@/types"

interface EditHotelFormProps {
  hotel: Hotel
  onSave: (updatedHotel: Partial<Hotel>) => void
  onCancel: () => void
}

export function EditHotelForm({ hotel, onSave, onCancel }: EditHotelFormProps) {
  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: hotel.name,
    code: hotel.code,
    hasAtm: hotel.hasAtm,
    employees: hotel.employees,
    email: hotel.email,
    taxInfo: hotel.taxInfo,
    city: hotel.city,
    zipCode: hotel.zipCode,
    businessType: hotel.businessType,
    country: hotel.country,
    phone: hotel.phone,
    fax: hotel.fax || "",
    website: hotel.website || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof Hotel, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    onSave(formData)
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Επωνυμία</Label>
            <Input
              id="name"
              placeholder="Εισάγετε επωνυμία"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Κωδικός</Label>
            <Input
              id="code"
              placeholder="Εισάγετε κωδικό"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="business-type">Είδος Επιχείρησης</Label>
            <Select value={formData.businessType} onValueChange={(value) => handleChange("businessType", value)}>
              <SelectTrigger id="business-type">
                <SelectValue placeholder="Επιλέξτε τύπο" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ξενοδοχείο">Ξενοδοχείο</SelectItem>
                <SelectItem value="Θέρετρο">Θέρετρο</SelectItem>
                <SelectItem value="Μοτέλ">Μοτέλ</SelectItem>
                <SelectItem value="Ξενώνας">Ξενώνας</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employees">Αριθμός Υπαλλήλων</Label>
            <Input
              id="employees"
              type="number"
              placeholder="Εισάγετε αριθμό"
              value={formData.employees?.toString() || ""}
              onChange={(e) => handleChange("employees", Number.parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Διεύθυνση Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Εισάγετε email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax-info">ΔΟΥ</Label>
            <Input
              id="tax-info"
              placeholder="Εισάγετε ΔΟΥ"
              value={formData.taxInfo}
              onChange={(e) => handleChange("taxInfo", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Πόλη</Label>
            <Input
              id="city"
              placeholder="Εισάγετε πόλη"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ΤΚ</Label>
            <Input
              id="zip"
              placeholder="Εισάγετε ταχυδρομικό κώδικα"
              value={formData.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Χώρα</Label>
            <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Επιλέξτε χώρα" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ελλάδα">Ελλάδα</SelectItem>
                <SelectItem value="Κύπρος">Κύπρος</SelectItem>
                <SelectItem value="Ιταλία">Ιταλία</SelectItem>
                <SelectItem value="Ισπανία">Ισπανία</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Τηλέφωνο</Label>
            <Input
              id="phone"
              placeholder="Εισάγετε τηλέφωνο"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fax">Fax</Label>
            <Input
              id="fax"
              placeholder="Εισάγετε fax"
              value={formData.fax}
              onChange={(e) => handleChange("fax", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            placeholder="Εισάγετε διεύθυνση ιστοσελίδας"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="atm"
            checked={formData.hasAtm}
            onCheckedChange={(checked) => handleChange("hasAtm", checked as boolean)}
          />
          <Label htmlFor="atm">Διαθέσιμο ΑΤΜ</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Ακύρωση
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Αποθήκευση..." : "Αποθήκευση"}
        </Button>
      </DialogFooter>
    </div>
  )
}

