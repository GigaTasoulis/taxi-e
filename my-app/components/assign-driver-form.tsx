"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { Driver } from "@/types"

const assignDriverSchema = z.object({
  driverId: z.string({
    required_error: "Παρακαλώ επιλέξτε οδηγό",
  }),
})

type AssignDriverFormValues = z.infer<typeof assignDriverSchema>

interface AssignDriverFormProps {
  drivers: Driver[]
  currentDriverId?: string
  onSave: (driverId: string) => void
  onCancel: () => void
}

export function AssignDriverForm({ drivers, currentDriverId, onSave, onCancel }: AssignDriverFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AssignDriverFormValues>({
    resolver: zodResolver(assignDriverSchema),
    defaultValues: {
      driverId: currentDriverId || "",
    },
  })

  function onSubmit(data: AssignDriverFormValues) {
    setIsSubmitting(true)
    onSave(data.driverId)
    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="driverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Οδηγός</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε οδηγό" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} {driver.surname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Ακύρωση
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Αποθήκευση..." : "Αποθήκευση"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

