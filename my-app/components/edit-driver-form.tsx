"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import type { Driver } from "@/types"

interface EditDriverFormProps {
  driver: Driver
  onSave: (updatedDriver: Partial<Driver>) => void
  onCancel: () => void
}

export function EditDriverForm({ driver, onSave, onCancel }: EditDriverFormProps) {
  const [formData, setFormData] = useState<Partial<Driver>>({
    name: driver.name,
    surname: driver.surname,
    taxId: driver.taxId,
    salary: driver.salary,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof Driver, value: any) => {
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
            <Label htmlFor="name">Όνομα</Label>
            <Input
              id="name"
              placeholder="Εισάγετε όνομα"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Επώνυμο</Label>
            <Input
              id="surname"
              placeholder="Εισάγετε επώνυμο"
              value={formData.surname}
              onChange={(e) => handleChange("surname", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax-id">ΑΦΜ</Label>
          <Input
            id="tax-id"
            placeholder="Εισάγετε ΑΦΜ"
            value={formData.taxId}
            onChange={(e) => handleChange("taxId", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Μισθός</Label>
          <Input
            id="salary"
            type="number"
            placeholder="Εισάγετε μηνιαίο μισθό"
            value={formData.salary?.toString() || ""}
            onChange={(e) => handleChange("salary", Number.parseInt(e.target.value) || 0)}
          />
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

