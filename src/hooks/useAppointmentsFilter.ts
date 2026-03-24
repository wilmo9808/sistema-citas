import { useMemo } from 'react'
import { useAppointments } from '@/context/AppointmentContext/AppointmentContext'

export const useAppointmentsFilter = () => {
    const { state, dispatch } = useAppointments()

    const filteredAppointments = useMemo(() => {
        return state.appointments.filter(apt => {
            // Filtro por estado
            if (state.filters.status !== 'all' && apt.status !== state.filters.status) {
                return false
            }

            // Filtro por fecha
            if (state.filters.date && apt.date !== state.filters.date) {
                return false
            }

            // Filtro por búsqueda
            if (state.filters.search) {
                const searchLower = state.filters.search.toLowerCase()
                return apt.client_name.toLowerCase().includes(searchLower) ||
                    apt.client_email.toLowerCase().includes(searchLower)
            }

            return true
        })
    }, [state.appointments, state.filters])

    const setStatusFilter = (status: string) => {
        dispatch({ type: 'SET_FILTER_STATUS', payload: status })
    }

    const setDateFilter = (date: string | null) => {
        dispatch({ type: 'SET_FILTER_DATE', payload: date })
    }

    const setSearchFilter = (search: string) => {
        dispatch({ type: 'SET_FILTER_SEARCH', payload: search })
    }

    const clearFilters = () => {
        dispatch({ type: 'CLEAR_FILTERS' })
    }

    return {
        filteredAppointments,
        filters: state.filters,
        setStatusFilter,
        setDateFilter,
        setSearchFilter,
        clearFilters
    }
}