export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string | null
                    email: string | null
                    role: string
                    created_at: string
                }
                Insert: {
                    id: string
                    name?: string | null
                    email?: string | null
                    role?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    email?: string | null
                    role?: string
                    created_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    name: string
                    duration: number
                    price: number
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    duration: number
                    price: number
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    duration?: number
                    price?: number
                    description?: string | null
                    created_at?: string
                }
            }
            patients: {                    // 👈 NUEVA TABLA
                Row: {
                    id: string
                    name: string
                    email: string | null
                    phone: string | null
                    sexo: 'M' | 'F' | 'Otro' | null
                    edad: number | null
                    documento: string | null
                    peso: number | null
                    estatura: number | null
                    user_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email?: string | null
                    phone?: string | null
                    sexo?: 'M' | 'F' | 'Otro' | null
                    edad?: number | null
                    documento?: string | null
                    peso?: number | null
                    estatura?: number | null
                    user_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string | null
                    phone?: string | null
                    sexo?: 'M' | 'F' | 'Otro' | null
                    edad?: number | null
                    documento?: string | null
                    peso?: number | null
                    estatura?: number | null
                    user_id?: string
                    created_at?: string
                }
            }
            appointments: {
                Row: {
                    id: string
                    client_name: string
                    client_email: string
                    date: string
                    time: string
                    service_id: string
                    service_name: string
                    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    notes: string | null
                    user_id: string
                    patient_id: string | null      // 👈 NUEVO
                    created_at: string
                }
                Insert: {
                    id?: string
                    client_name: string
                    client_email: string
                    date: string
                    time: string
                    service_id: string
                    service_name: string
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    notes?: string | null
                    user_id: string
                    patient_id?: string | null      // 👈 NUEVO
                    created_at?: string
                }
                Update: {
                    id?: string
                    client_name?: string
                    client_email?: string
                    date?: string
                    time?: string
                    service_id?: string
                    service_name?: string
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    notes?: string | null
                    user_id?: string
                    patient_id?: string | null      // 👈 NUEVO
                    created_at?: string
                }
            }
            documents: {                     // 👈 MODIFICADA
                Row: {
                    id: string
                    name: string
                    type: string
                    size: number
                    url: string
                    category: string
                    patient_id: string           // 👈 NUEVO
                    user_id: string              // 👈 MANTENER
                    appointment_id: string | null // 👈 NUEVO
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    type: string
                    size: number
                    url: string
                    category: string
                    patient_id: string
                    user_id: string
                    appointment_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    type?: string
                    size?: number
                    url?: string
                    category?: string
                    patient_id?: string
                    user_id?: string
                    appointment_id?: string | null
                    created_at?: string
                }
            }
        }
    }
}