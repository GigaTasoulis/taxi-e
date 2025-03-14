"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Booking, Hotel, Driver, Route, Payment } from "@/types"

// Define the store state type
type StoreState = {
  bookings: Booking[]
  hotels: Hotel[]
  drivers: Driver[]
  routes: Route[]
  payments: Payment[]
}

// Define the store context type with actions
type StoreContextType = {
  state: StoreState
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "status">) => void
  addHotel: (hotel: Omit<Hotel, "id" | "lastLogin">) => void
  addDriver: (driver: Omit<Driver, "id" | "routesCompleted" | "lastPayment">) => void
  updateBooking: (id: string, booking: Partial<Booking>) => void
  updateHotel: (id: string, hotel: Partial<Hotel>) => void
  updateDriver: (id: string, driver: Partial<Driver>) => void
  deleteBooking: (id: string) => void
  deleteHotel: (id: string) => void
  deleteDriver: (id: string) => void
  addRoute: (route: Omit<Route, "id">) => void
  addPayment: (payment: Omit<Payment, "id">) => void
}

// Sample data
const sampleBookings: Booking[] = [
  {
    id: "b1",
    bookingType: "arrival",
    origin: "Αεροδρόμιο Αθηνών",
    destination: "Grand Hotel",
    pickupDate: "2025-03-15",
    departureTime: "14:30",
    roomNumber: "301",
    flightTime: "13:45",
    flightNumber: "A3-1821",
    passengers: {
      adults: 2,
      children: 1,
      infants: 0,
    },
    client: {
      title: "mr",
      name: "Γιάννης Παπαδόπουλος",
      idNumber: "ΑΚ123456",
      email: "giannis@example.com",
      phone: "+30 6912345678",
      nationality: "Ελληνική",
    },
    bookingCode: "BK12345",
    comments: "Παρακαλώ να υπάρχει παιδικό κάθισμα",
    paymentOption: "client",
    voucherNumber: "V12345",
    displaySign: true,
    createdAt: "2025-03-10T10:30:00",
    status: "confirmed",
  },
  {
    id: "b2",
    bookingType: "departure",
    origin: "Seaside Resort",
    destination: "Αεροδρόμιο Αθηνών",
    pickupDate: "2025-03-16",
    departureTime: "10:00",
    roomNumber: "205",
    flightTime: "13:20",
    flightNumber: "LH-1835",
    passengers: {
      adults: 2,
      children: 0,
      infants: 0,
    },
    client: {
      title: "mrs",
      name: "Μαρία Κωνσταντίνου",
      email: "maria@example.com",
      phone: "+30 6987654321",
      nationality: "Ελληνική",
    },
    paymentOption: "accounting",
    voucherNumber: "V12346",
    displaySign: false,
    createdAt: "2025-03-11T09:15:00",
    status: "confirmed",
  },
  {
    id: "b3",
    bookingType: "transfer",
    origin: "Grand Hotel",
    destination: "City Center Inn",
    pickupDate: "2025-03-17",
    departureTime: "11:30",
    roomNumber: "412",
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    client: {
      title: "mr",
      name: "Δημήτρης Αντωνίου",
      email: "dimitris@example.com",
      phone: "+30 6932145678",
      nationality: "Ελληνική",
    },
    paymentOption: "complimentary",
    displaySign: false,
    createdAt: "2025-03-12T14:20:00",
    status: "pending",
  },
]

const sampleHotels: Hotel[] = [
  {
    id: "h1",
    name: "Grand Hotel",
    code: "GH001",
    hasAtm: true,
    employees: 120,
    email: "info@grandhotel.com",
    taxInfo: "ΔΟΥ Αθηνών",
    city: "Αθήνα",
    zipCode: "10431",
    businessType: "Ξενοδοχείο",
    country: "Ελλάδα",
    phone: "+30 210 1234567",
    fax: "+30 210 1234568",
    website: "www.grandhotel.com",
    lastLogin: "2025-03-10T14:30:00",
  },
  {
    id: "h2",
    name: "Seaside Resort",
    code: "SR002",
    hasAtm: false,
    employees: 85,
    email: "contact@seasideresort.com",
    taxInfo: "ΔΟΥ Πειραιά",
    city: "Πειραιάς",
    zipCode: "18536",
    businessType: "Θέρετρο",
    country: "Ελλάδα",
    phone: "+30 210 5678901",
    fax: "+30 210 5678902",
    website: "www.seasideresort.com",
    lastLogin: "2025-03-09T09:15:00",
  },
  {
    id: "h3",
    name: "City Center Inn",
    code: "CCI003",
    hasAtm: true,
    employees: 45,
    email: "info@citycenterinn.com",
    taxInfo: "ΔΟΥ Θεσσαλονίκης",
    city: "Θεσσαλονίκη",
    zipCode: "54624",
    businessType: "Ξενοδοχείο",
    country: "Ελλάδα",
    phone: "+30 2310 123456",
    fax: "+30 2310 123457",
    website: "www.citycenterinn.com",
    lastLogin: "2025-03-08T16:45:00",
  },
]

const sampleDrivers: Driver[] = [
  {
    id: "d1",
    name: "Γιάννης",
    surname: "Παπαδόπουλος",
    taxId: "123456789",
    salary: 1200,
    routesCompleted: 128,
    lastPayment: "2025-03-01",
  },
  {
    id: "d2",
    name: "Μαρία",
    surname: "Γεωργίου",
    taxId: "987654321",
    salary: 1300,
    routesCompleted: 156,
    lastPayment: "2025-03-01",
  },
  {
    id: "d3",
    name: "Δημήτρης",
    surname: "Αντωνίου",
    taxId: "456789123",
    salary: 1150,
    routesCompleted: 112,
    lastPayment: "2025-03-01",
  },
]

const sampleRoutes: Route[] = [
  {
    id: "r1",
    driverId: "d1",
    date: "2025-03-15",
    origin: "Αεροδρόμιο Αθηνών",
    destination: "Grand Hotel",
    distance: 32.5,
    duration: 45,
    status: "completed",
    bookingId: "b1",
  },
  {
    id: "r2",
    driverId: "d2",
    date: "2025-03-16",
    origin: "Seaside Resort",
    destination: "Αεροδρόμιο Αθηνών",
    distance: 28.3,
    duration: 38,
    status: "pending",
    bookingId: "b2",
  },
]

const samplePayments: Payment[] = [
  {
    id: "p1",
    driverId: "d1",
    date: "2025-03-01",
    amount: 1200,
    type: "salary",
    reference: "ΠΛΗ10001",
    status: "paid",
  },
  {
    id: "p2",
    driverId: "d2",
    date: "2025-03-01",
    amount: 1300,
    type: "salary",
    reference: "ΠΛΗ10002",
    status: "paid",
  },
]

// Create the store context
const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Create a provider component
export function StoreProvider({ children }: { children: ReactNode }) {
  // Initialize state with sample data or from localStorage
  const [state, setState] = useState<StoreState>(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("taxiAppState")
      if (savedState) {
        return JSON.parse(savedState)
      }
    }

    // Default initial state with sample data
    return {
      bookings: sampleBookings,
      hotels: sampleHotels,
      drivers: sampleDrivers,
      routes: sampleRoutes,
      payments: samplePayments,
    }
  })

  // Save state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("taxiAppState", JSON.stringify(state))
    }
  }, [state])

  // Action to add a new booking
  const addBooking = (booking: Omit<Booking, "id" | "createdAt" | "status">) => {
    const newBooking: Booking = {
      ...booking,
      id: `b${state.bookings.length + 1}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    }

    setState((prev) => ({
      ...prev,
      bookings: [...prev.bookings, newBooking],
    }))
  }

  // Action to add a new hotel
  const addHotel = (hotel: Omit<Hotel, "id" | "lastLogin">) => {
    const newHotel: Hotel = {
      ...hotel,
      id: `h${state.hotels.length + 1}`,
      lastLogin: new Date().toISOString(),
    }

    setState((prev) => ({
      ...prev,
      hotels: [...prev.hotels, newHotel],
    }))
  }

  // Action to add a new driver
  const addDriver = (driver: Omit<Driver, "id" | "routesCompleted" | "lastPayment">) => {
    const newDriver: Driver = {
      ...driver,
      id: `d${state.drivers.length + 1}`,
      routesCompleted: 0,
      lastPayment: new Date().toISOString().split("T")[0],
    }

    setState((prev) => ({
      ...prev,
      drivers: [...prev.drivers, newDriver],
    }))
  }

  // Action to update a booking
  const updateBooking = (id: string, booking: Partial<Booking>) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, ...booking } : b)),
    }))
  }

  // Action to update a hotel
  const updateHotel = (id: string, hotel: Partial<Hotel>) => {
    setState((prev) => ({
      ...prev,
      hotels: prev.hotels.map((h) => (h.id === id ? { ...h, ...hotel } : h)),
    }))
  }

  // Action to update a driver
  const updateDriver = (id: string, driver: Partial<Driver>) => {
    setState((prev) => ({
      ...prev,
      drivers: prev.drivers.map((d) => (d.id === id ? { ...d, ...driver } : d)),
    }))
  }

  // Action to delete a booking
  const deleteBooking = (id: string) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.filter((b) => b.id !== id),
    }))
  }

  // Action to delete a hotel
  const deleteHotel = (id: string) => {
    setState((prev) => ({
      ...prev,
      hotels: prev.hotels.filter((h) => h.id !== id),
    }))
  }

  // Action to delete a driver
  const deleteDriver = (id: string) => {
    setState((prev) => ({
      ...prev,
      drivers: prev.drivers.filter((d) => d.id !== id),
    }))
  }

  // Action to add a new route
  const addRoute = (route: Omit<Route, "id">) => {
    const newRoute: Route = {
      ...route,
      id: `r${state.routes.length + 1}`,
    }

    setState((prev) => ({
      ...prev,
      routes: [...prev.routes, newRoute],
    }))
  }

  // Action to add a new payment
  const addPayment = (payment: Omit<Payment, "id">) => {
    const newPayment: Payment = {
      ...payment,
      id: `p${state.payments.length + 1}`,
    }

    setState((prev) => ({
      ...prev,
      payments: [...prev.payments, newPayment],
    }))
  }

  // Create the context value
  const contextValue: StoreContextType = {
    state,
    addBooking,
    addHotel,
    addDriver,
    updateBooking,
    updateHotel,
    updateDriver,
    deleteBooking,
    deleteHotel,
    deleteDriver,
    addRoute,
    addPayment,
  }

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>
}

// Custom hook to use the store
export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

