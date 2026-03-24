import { useMemo } from 'react'
import { useAppointments } from '@/context/AppointmentContext/AppointmentContext'

export const useAppointmentsStats = () => {
    const { state } = useAppointments()

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0]
        const appointments = state.appointments

        return {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'pending').length,
            confirmed: appointments.filter(a => a.status === 'confirmed').length,
            completed: appointments.filter(a => a.status === 'completed').length,
            cancelled: appointments.filter(a => a.status === 'cancelled').length,
            upcoming: appointments.filter(a => a.date >= today && a.status !== 'cancelled').length,

            // Porcentajes
            pendingPercentage: appointments.length ?
                Math.round((appointments.filter(a => a.status === 'pending').length / appointments.length) * 100) : 0,
            confirmedPercentage: appointments.length ?
                Math.round((appointments.filter(a => a.status === 'confirmed').length / appointments.length) * 100) : 0,

            // Agrupados por fecha
            byDate: appointments.reduce((acc, apt) => {
                acc[apt.date] = (acc[apt.date] || 0) + 1
                return acc
            }, {} as Record<string, number>),

            // Próximos 7 días
            nextWeek: appointments.filter(a => {
                const aptDate = new Date(a.date)
                const weekFromNow = new Date()
                weekFromNow.setDate(weekFromNow.getDate() + 7)
                return aptDate >= new Date() && aptDate <= weekFromNow && a.status !== 'cancelled'
            }).length
        }
    }, [state.appointments])

    return stats
}