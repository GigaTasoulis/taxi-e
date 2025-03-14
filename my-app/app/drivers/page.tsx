"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Plus, Trash, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import type { Driver, Payment } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EditDriverForm } from "@/components/edit-driver-form"
import { AddPaymentForm } from "@/components/add-payment-form"
import { useToast } from "@/hooks/use-toast"

export default function DriversPage() {
  const router = useRouter()
  const { state, addDriver, updateDriver, deleteDriver, addPayment } = useStore()
  const { toast } = useToast()
  const { drivers, routes, payments } = state

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false)
  const [isEditDriverOpen, setIsEditDriverOpen] = useState(false)
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null)
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    name: "",
    surname: "",
    taxId: "",
    salary: 0,
  })

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.taxId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.surname || !newDriver.taxId) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.",
        variant: "destructive",
      })
      return
    }

    addDriver(newDriver as Omit<Driver, "id" | "routesCompleted" | "lastPayment">)
    setIsAddDriverOpen(false)

    toast({
      title: "Επιτυχία!",
      description: "Ο οδηγός προστέθηκε με επιτυχία.",
      variant: "success",
    })

    setNewDriver({
      name: "",
      surname: "",
      taxId: "",
      salary: 0,
    })
  }

  const handleEditDriver = (driver: Driver) => {
    setCurrentDriver(driver)
    setIsEditDriverOpen(true)
  }

  const handleUpdateDriver = (updatedDriver: Partial<Driver>) => {
    if (currentDriver) {
      updateDriver(currentDriver.id, updatedDriver)
      setIsEditDriverOpen(false)
      setCurrentDriver(null)

      toast({
        title: "Επιτυχία!",
        description: "Τα στοιχεία του οδηγού ενημερώθηκαν με επιτυχία.",
        variant: "success",
      })
    }
  }

  const handleDeleteDriver = (id: string) => {
    deleteDriver(id)

    toast({
      title: "Επιτυχία!",
      description: "Ο οδηγός διαγράφηκε με επιτυχία.",
      variant: "success",
    })
  }

  const handleAddPayment = (driver: Driver) => {
    setCurrentDriver(driver)
    setIsAddPaymentOpen(true)
  }

  const handleSavePayment = (newPayment: Omit<Payment, "id">) => {
    addPayment(newPayment)
    setIsAddPaymentOpen(false)
    setCurrentDriver(null)

    toast({
      title: "Επιτυχία!",
      description: "Η πληρωμή καταχωρήθηκε με επιτυχία.",
      variant: "success",
    })
  }

  // Get routes for a specific driver
  const getDriverRoutes = (driverId: string) => {
    return routes.filter((route) => route.driverId === driverId)
  }

  // Get payments for a specific driver
  const getDriverPayments = (driverId: string) => {
    return payments.filter((payment) => payment.driverId === driverId)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Διαχείριση Οδηγών</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Οδηγοί</CardTitle>
              <CardDescription>Διαχείριση πληροφοριών και πληρωμών οδηγών</CardDescription>
            </div>
            <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Προσθήκη Οδηγού
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Προσθήκη Νέου Οδηγού</DialogTitle>
                  <DialogDescription>
                    Εισάγετε τα στοιχεία για τον νέο οδηγό. Κάντε κλικ στο αποθήκευση όταν τελειώσετε.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Όνομα</Label>
                      <Input
                        id="name"
                        placeholder="Εισάγετε όνομα"
                        value={newDriver.name}
                        onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surname">Επώνυμο</Label>
                      <Input
                        id="surname"
                        placeholder="Εισάγετε επώνυμο"
                        value={newDriver.surname}
                        onChange={(e) => setNewDriver({ ...newDriver, surname: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-id">ΑΦΜ</Label>
                    <Input
                      id="tax-id"
                      placeholder="Εισάγετε ΑΦΜ"
                      value={newDriver.taxId}
                      onChange={(e) => setNewDriver({ ...newDriver, taxId: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Μισθός</Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="Εισάγετε μηνιαίο μισθό"
                      value={newDriver.salary?.toString() || ""}
                      onChange={(e) => setNewDriver({ ...newDriver, salary: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDriverOpen(false)}>
                    Ακύρωση
                  </Button>
                  <Button type="submit" onClick={handleAddDriver}>
                    Αποθήκευση
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="drivers" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="drivers">Οδηγοί</TabsTrigger>
              <TabsTrigger value="routes">Ιστορικό Διαδρομών</TabsTrigger>
              <TabsTrigger value="payments">Ιστορικό Πληρωμών</TabsTrigger>
            </TabsList>

            <TabsContent value="drivers">
              <div className="mb-4">
                <Input
                  placeholder="Αναζήτηση οδηγών..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ονοματεπώνυμο</TableHead>
                      <TableHead>ΑΦΜ</TableHead>
                      <TableHead>Μισθός</TableHead>
                      <TableHead>Ολοκληρωμένες Διαδρομές</TableHead>
                      <TableHead>Τελευταία Πληρωμή</TableHead>
                      <TableHead className="text-right">Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">
                          {driver.name} {driver.surname}
                        </TableCell>
                        <TableCell>{driver.taxId}</TableCell>
                        <TableCell>{driver.salary.toFixed(2)}€</TableCell>
                        <TableCell>{driver.routesCompleted}</TableCell>
                        <TableCell>
                          {driver.lastPayment ? new Date(driver.lastPayment).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleAddPayment(driver)}>
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditDriver(driver)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Διαγραφή Οδηγού</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Είστε βέβαιοι ότι θέλετε να διαγράψετε τον οδηγό "{driver.name} {driver.surname}"?
                                    Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteDriver(driver.id)}>
                                    Διαγραφή
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="routes">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Οδηγός</TableHead>
                      <TableHead>Ημερομηνία</TableHead>
                      <TableHead>Διαδρομή</TableHead>
                      <TableHead>Απόσταση</TableHead>
                      <TableHead>Διάρκεια</TableHead>
                      <TableHead>Κατάσταση</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route) => {
                      const driver = drivers.find((d) => d.id === route.driverId)
                      return (
                        <TableRow key={route.id}>
                          <TableCell className="font-medium">
                            {driver ? `${driver.name} ${driver.surname}` : "Άγνωστος"}
                          </TableCell>
                          <TableCell>{new Date(route.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {route.origin} → {route.destination}
                          </TableCell>
                          <TableCell>{route.distance.toFixed(1)} χλμ</TableCell>
                          <TableCell>{route.duration} λεπτά</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 text-xs rounded-full 
                              ${
                                route.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : route.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : route.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {route.status === "completed"
                                ? "Ολοκληρώθηκε"
                                : route.status === "pending"
                                  ? "Σε αναμονή"
                                  : route.status === "cancelled"
                                    ? "Ακυρώθηκε"
                                    : "Σε εξέλιξη"}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Οδηγός</TableHead>
                      <TableHead>Ημερομηνία</TableHead>
                      <TableHead>Ποσό</TableHead>
                      <TableHead>Τύπος</TableHead>
                      <TableHead>Αναφορά</TableHead>
                      <TableHead>Κατάσταση</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => {
                      const driver = drivers.find((d) => d.id === payment.driverId)
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {driver ? `${driver.name} ${driver.surname}` : "Άγνωστος"}
                          </TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell>{payment.amount.toFixed(2)}€</TableCell>
                          <TableCell>
                            {payment.type === "salary"
                              ? "Μισθός"
                              : payment.type === "bonus"
                                ? "Μπόνους"
                                : "Προκαταβολή"}
                          </TableCell>
                          <TableCell>{payment.reference}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 text-xs rounded-full 
                              ${
                                payment.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {payment.status === "paid"
                                ? "Πληρώθηκε"
                                : payment.status === "pending"
                                  ? "Σε αναμονή"
                                  : "Ακυρώθηκε"}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Driver Dialog */}
      <Dialog open={isEditDriverOpen} onOpenChange={setIsEditDriverOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Επεξεργασία Οδηγού</DialogTitle>
            <DialogDescription>
              Τροποποιήστε τα στοιχεία του οδηγού και πατήστε αποθήκευση όταν τελειώσετε.
            </DialogDescription>
          </DialogHeader>
          {currentDriver && (
            <EditDriverForm
              driver={currentDriver}
              onSave={handleUpdateDriver}
              onCancel={() => {
                setIsEditDriverOpen(false)
                setCurrentDriver(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Προσθήκη Πληρωμής</DialogTitle>
            <DialogDescription>
              {currentDriver && `Καταχώρηση πληρωμής για τον οδηγό ${currentDriver.name} ${currentDriver.surname}`}
            </DialogDescription>
          </DialogHeader>
          {currentDriver && (
            <AddPaymentForm
              driverId={currentDriver.id}
              onSave={handleSavePayment}
              onCancel={() => {
                setIsAddPaymentOpen(false)
                setCurrentDriver(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

