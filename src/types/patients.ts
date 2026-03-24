export interface Patient {
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

export interface PatientFormData {
    name: string
    email?: string | null
    phone?: string | null
    sexo?: 'M' | 'F' | 'Otro' | null
    edad?: number | null
    documento?: string | null
    peso?: number | null
    estatura?: number | null
}