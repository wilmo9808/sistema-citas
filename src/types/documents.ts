export interface Document {
    id: string
    name: string
    type: string
    size: number
    url: string
    category: string
    patient_id: string
    user_id: string
    appointment_id: string | null
    created_at: string
}

export type DocumentCategory = 'receta' | 'radiografia' | 'informe' | 'otros'
