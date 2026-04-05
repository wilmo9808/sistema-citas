import { supabase } from './client'
import { Database } from '@/types/supabase'

type Appointment = Database['public']['Tables']['appointments']['Row']
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']

export const appointmentsService = {
    async getAll() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No hay usuario autenticado')

        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                services (
                    name,
                    duration,
                    price
                ),
                patients (
                    id,
                    name,
                    email,
                    phone
                )
            `)
            .eq('user_id', user.id)
            .order('date', { ascending: true })
            .order('time', { ascending: true })

        if (error) throw error
        return data
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                services (
                    name,
                    duration,
                    price
                ),
                patients (
                    id,
                    name,
                    email,
                    phone
                )
            `)
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    async create(appointment: Omit<AppointmentInsert, 'user_id'> & { patient_id?: string }) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No hay usuario autenticado')

        // Obtener el servicio
        const { data: service } = await supabase
            .from('services')
            .select('name')
            .eq('id', appointment.service_id)
            .single()

        // Si hay patient_id, usar el paciente existente
        // Si no, el paciente se creará antes de llamar a esta función
        const { data, error } = await supabase
            .from('appointments')
            .insert({
                ...appointment,
                user_id: user.id,
                service_name: service?.name || '',
                status: 'pending'
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    async update(id: string, updates: AppointmentUpdate) {
        const { data, error } = await supabase
            .from('appointments')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    },

    async getByDate(date: string) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No hay usuario autenticado')

        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', date)
            .order('time')

        if (error) throw error
        return data
    },

    async getByStatus(status: Appointment['status']) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No hay usuario autenticado')

        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', status)
            .order('date')

        if (error) throw error
        return data
    },

    async getUpcoming() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No hay usuario autenticado')

        const today = new Date().toISOString().split('T')[0]

        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', today)
            .order('date')
            .order('time')

        if (error) throw error
        return data
    },

    async changeStatus(id: string, status: Appointment['status']) {
        return await this.update(id, { status })
    },

    async getServices() {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('name')

        if (error) throw error
        return data
    },

    subscribeToChanges(callback: (payload: any) => void) {
        return supabase
            .channel('appointments-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'appointments'
                },
                callback
            )
            .subscribe()
    }
}