import { supabase } from './client'
import { Patient, PatientFormData } from '@/types/patients'

export const patientsService = {

    async getAll(): Promise<Patient[]> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No hay usuario autenticado')

        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('user_id', user.id)
            .order('name', { ascending: true })

        if (error) throw error
        return data as Patient[]
    },

    async getById(id: string): Promise<Patient> {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as Patient
    },

    async create(data: PatientFormData): Promise<Patient> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No hay usuario autenticado')

        const { data: patient, error } = await supabase
            .from('patients')
            .insert({
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                sexo: data.sexo || null,
                edad: data.edad || null,
                documento: data.documento || null,
                peso: data.peso || null,
                estatura: data.estatura || null,
                user_id: user.id
            })
            .select()
            .single()

        if (error) throw error
        return patient as Patient
    },

    async update(id: string, data: Partial<PatientFormData>): Promise<Patient> {
        const { data: patient, error } = await supabase
            .from('patients')
            .update({
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                sexo: data.sexo || null,
                edad: data.edad || null,
                documento: data.documento || null,
                peso: data.peso || null,
                estatura: data.estatura || null
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return patient as Patient
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('patients')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    async search(query: string): Promise<Patient[]> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No hay usuario autenticado')

        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('user_id', user.id)
            .or(`name.ilike.%${query}%,email.ilike.%${query}%,documento.ilike.%${query}%`)
            .order('name')

        if (error) throw error
        return data as Patient[]
    }
}