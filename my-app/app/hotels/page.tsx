"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import type { Hotel } from "@/types"
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
import { EditHotelForm } from "@/components/edit-hotel-form"
import { useToast } from "@/hooks/use-toast"

export default function HotelsPage() {
  const router = useRouter()
  const { state, addHotel, updateHotel, deleteHotel } = useStore()
  const { toast } = useToast()
  const { hotels } = state

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false)
  const [isEditHotelOpen, setIsEditHotelOpen] = useState(false)
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null)
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: "",
    code: "",
    hasAtm: false,
    employees: 0,
    email: "",
    taxInfo: "",
    city: "",
    zipCode: "",
    businessType: "Ξενοδοχείο",
    country: "Ελλάδα",
    phone: "",
    fax: "",
    website: "",
  })

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddHotel = () => {
    if (!newHotel.name || !newHotel.code) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.",
        variant: "destructive",
      })
      return
    }

    addHotel(newHotel as Omit<Hotel, "id" | "lastLogin">)
    setIsAddHotelOpen(false)

    toast({
      title: "Επιτυχία!",
      description: "Το ξενοδοχείο προστέθηκε με επιτυχία.",
      variant: "success",
    })

    setNewHotel({
      name: "",
      code: "",
      hasAtm: false,
      employees: 0,
      email: "",
      taxInfo: "",
      city: "",
      zipCode: "",
      businessType: "Ξενοδοχείο",
      country: "Ελλάδα",
      phone: "",
      fax: "",
      website: "",
    })
  }

  const handleEditHotel = (hotel: Hotel) => {
    setCurrentHotel(hotel)
    setIsEditHotelOpen(true)
  }

  const handleUpdateHotel = (updatedHotel: Partial<Hotel>) => {
    if (currentHotel) {
      updateHotel(currentHotel.id, updatedHotel)
      setIsEditHotelOpen(false)
      setCurrentHotel(null)

      toast({
        title: "Επιτυχία!",
        description: "Το ξενοδοχείο ενημερώθηκε με επιτυχία.",
        variant: "success",
      })
    }
  }

  const handleDeleteHotel = (id: string) => {
    deleteHotel(id)

    toast({
      title: "Επιτυχία!",
      description: "Το ξενοδοχείο διαγράφηκε με επιτυχία.",
      variant: "success",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Διαχείριση Ξενοδοχείων</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ξενοδοχεία</CardTitle>
              <CardDescription>Διαχείριση πληροφοριών και ρυθμίσεων ξενοδοχείων</CardDescription>
            </div>
            <Dialog open={isAddHotelOpen} onOpenChange={setIsAddHotelOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Προσθήκη Ξενοδοχείου
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Προσθήκη Νέου Ξενοδοχείου</DialogTitle>
                  <DialogDescription>
                    Εισάγετε τα στοιχεία για το νέο ξενοδοχείο. Κάντε κλικ στο αποθήκευση όταν τελειώσετε.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Επωνυμία</Label>
                      <Input
                        id="name"
                        placeholder="Εισάγετε επωνυμία"
                        value={newHotel.name}
                        onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Κωδικός</Label>
                      <Input
                        id="code"
                        placeholder="Εισάγετε κωδικό"
                        value={newHotel.code}
                        onChange={(e) => setNewHotel({ ...newHotel, code: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-type">Είδος Επιχείρησης</Label>
                      <Select
                        value={newHotel.businessType}
                        onValueChange={(value) => setNewHotel({ ...newHotel, businessType: value })}
                      >
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
                        value={newHotel.employees?.toString() || ""}
                        onChange={(e) => setNewHotel({ ...newHotel, employees: Number.parseInt(e.target.value) || 0 })}
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
                        value={newHotel.email}
                        onChange={(e) => setNewHotel({ ...newHotel, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-info">ΔΟΥ</Label>
                      <Input
                        id="tax-info"
                        placeholder="Εισάγετε ΔΟΥ"
                        value={newHotel.taxInfo}
                        onChange={(e) => setNewHotel({ ...newHotel, taxInfo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Πόλη</Label>
                      <Input
                        id="city"
                        placeholder="Εισάγετε πόλη"
                        value={newHotel.city}
                        onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ΤΚ</Label>
                      <Input
                        id="zip"
                        placeholder="Εισάγετε ταχυδρομικό κώδικα"
                        value={newHotel.zipCode}
                        onChange={(e) => setNewHotel({ ...newHotel, zipCode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Χώρα</Label>
                      <Select
                        value={newHotel.country}
                        onValueChange={(value) => setNewHotel({ ...newHotel, country: value })}
                      >
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
                        value={newHotel.phone}
                        onChange={(e) => setNewHotel({ ...newHotel, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fax">Fax</Label>
                      <Input
                        id="fax"
                        placeholder="Εισάγετε fax"
                        value={newHotel.fax}
                        onChange={(e) => setNewHotel({ ...newHotel, fax: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="Εισάγετε διεύθυνση ιστοσελίδας"
                      value={newHotel.website}
                      onChange={(e) => setNewHotel({ ...newHotel, website: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="atm"
                      checked={newHotel.hasAtm}
                      onCheckedChange={(checked) => setNewHotel({ ...newHotel, hasAtm: checked as boolean })}
                    />
                    <Label htmlFor="atm">Διαθέσιμο ΑΤΜ</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddHotelOpen(false)}>
                    Ακύρωση
                  </Button>
                  <Button type="submit" onClick={handleAddHotel}>
                    Αποθήκευση
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Αναζήτηση ξενοδοχείων..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Επωνυμία</TableHead>
                  <TableHead>Κωδικός</TableHead>
                  <TableHead>Τοποθεσία</TableHead>
                  <TableHead>Επικοινωνία</TableHead>
                  <TableHead>Υπάλληλοι</TableHead>
                  <TableHead>ΑΤΜ</TableHead>
                  <TableHead className="text-right">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-medium">{hotel.name}</TableCell>
                    <TableCell>{hotel.code}</TableCell>
                    <TableCell>
                      {hotel.city}, {hotel.country}
                    </TableCell>
                    <TableCell>{hotel.email}</TableCell>
                    <TableCell>{hotel.employees}</TableCell>
                    <TableCell>{hotel.hasAtm ? "Ναι" : "Όχι"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditHotel(hotel)}>
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
                              <AlertDialogTitle>Διαγραφή Ξενοδοχείου</AlertDialogTitle>
                              <AlertDialogDescription>
                                Είστε βέβαιοι ότι θέλετε να διαγράψετε το ξενοδοχείο "{hotel.name}"? Αυτή η ενέργεια δεν
                                μπορεί να αναιρεθεί.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteHotel(hotel.id)}>
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
        </CardContent>
      </Card>

      {/* Edit Hotel Dialog */}
      <Dialog open={isEditHotelOpen} onOpenChange={setIsEditHotelOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Επεξεργασία Ξενοδοχείου</DialogTitle>
            <DialogDescription>
              Τροποποιήστε τα στοιχεία του ξενοδοχείου και πατήστε αποθήκευση όταν τελειώσετε.
            </DialogDescription>
          </DialogHeader>
          {currentHotel && (
            <EditHotelForm
              hotel={currentHotel}
              onSave={handleUpdateHotel}
              onCancel={() => {
                setIsEditHotelOpen(false)
                setCurrentHotel(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

