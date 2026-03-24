import { supabase } from './client'
import { Database } from '@/types/supabase'

type Service = Database['public']['Tables']['services']['Row']

export const servicesService = {
    // Obtener todos los servicios
    async getAll() {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('name')

        if (error) throw error
        return data as Service[]
    },

    // Obtener servicio por ID
    async getById(id: string) {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as Service
    }
}