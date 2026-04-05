import { useState, useEffect } from 'react'
import { appointmentsService } from '@/services/supabase/appointments'
import { Database } from '@/types/supabase'

type Appointment = Database['public']['Tables']['appointments']['Row']

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadAppointments = async () => {
        try {
            setLoading(true)
            const data = await appointmentsService.getAll()
            setAppointments(data)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar citas')
        } finally {
            setLoading(false)
        }
    }

    const createAppointment = async (appointment: Omit<Database['public']['Tables']['appointments']['Insert'], 'user_id'>) => {
        try {
            const newAppointment = await appointmentsService.create({
                ...appointment,
                patient_id: appointment.patient_id || undefined
            })
            setAppointments(prev => [...prev, newAppointment])
            return newAppointment
        } catch (err) {
            throw err
        }
    }

    const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
        try {
            const updated = await appointmentsService.update(id, updates)
            setAppointments(prev =>
                prev.map(apt => apt.id === id ? updated : apt)
            )
            return updated
        } catch (err) {
            throw err
        }
    }

    const deleteAppointment = async (id: string) => {
        try {
            await appointmentsService.delete(id)
            setAppointments(prev => prev.filter(apt => apt.id !== id))
        } catch (err) {
            throw err
        }
    }

    useEffect(() => {
        loadAppointments()

        // Suscripción en tiempo real
        const subscription = appointmentsService.subscribeToChanges(() => {
            loadAppointments()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return {
        appointments,
        loading,
        error,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        refresh: loadAppointments
    }
}