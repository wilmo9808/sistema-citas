export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
}

export interface Appointment {
    id: string
    clientName: string
    clientEmail: string
    date: string
    time: string
    service: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    notes?: string
    userId: string
    createdAt?: string
}

export interface AppointmentFormData {
    clientName: string
    clientEmail: string
    date: string
    time: string
    service: string
    notes?: string
}

export interface Service {
    id: string
    name: string
    duration: number
    price: number
}

export interface ApiResponse<T> {
    data: T
    message?: string
    error?: string
}