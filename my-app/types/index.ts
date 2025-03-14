export interface Booking {
  id: string
  bookingType: "arrival" | "departure" | "transfer"
  origin: string
  destination: string
  pickupDate: string
  departureTime: string
  roomNumber?: string
  flightTime?: string
  flightNumber?: string
  passengers: {
    adults: number
    children: number
    infants: number
  }
  client: {
    title: string
    name: string
    idNumber?: string
    email: string
    phone: string
    nationality: string
  }
  bookingCode?: string
  comments?: string
  paymentOption: "client" | "accounting" | "complimentary"
  voucherNumber?: string
  displaySign: boolean
  createdAt: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  driverId?: string // Added driverId field to assign a driver to a booking
}

// Hotel Types
export interface Hotel {
  id: string
  name: string
  code: string
  hasAtm: boolean
  employees: number
  email: string
  taxInfo: string
  city: string
  zipCode: string
  businessType: string
  country: string
  phone: string
  fax?: string
  website?: string
  lastLogin?: string
  logoUrl?: string
}

// Driver Types
export interface Driver {
  id: string
  name: string
  surname: string
  taxId: string
  salary: number
  routesCompleted: number
  lastPayment?: string
}

export interface Route {
  id: string
  driverId: string
  date: string
  origin: string
  destination: string
  distance: number
  duration: number
  status: "pending" | "in-progress" | "completed" | "cancelled"
  bookingId: string
}

export interface Payment {
  id: string
  driverId: string
  date: string
  amount: number
  type: "salary" | "bonus" | "advance"
  reference: string
  status: "pending" | "paid" | "cancelled"
}

