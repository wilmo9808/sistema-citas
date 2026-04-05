import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Database } from '@/types/supabase'
import { appointmentsService } from '@/services/supabase/appointments'

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
    services?: {
        name: string
        duration: number
        price: number
    }
}

type Service = Database['public']['Tables']['services']['Row']

interface AppointmentState {
    appointments: Appointment[]
    services: Service[]
    loading: boolean
    error: string | null
    filters: {
        status: string
        date: string | null
        search: string
    }
    stats: {
        total: number
        pending: number
        confirmed: number
        completed: number
        cancelled: number
        upcoming: number
    }
}

type AppointmentAction =
    | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
    | { type: 'SET_SERVICES'; payload: Service[] }
    | { type: 'ADD_APPOINTMENT'; payload: Appointment }
    | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
    | { type: 'DELETE_APPOINTMENT'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_FILTER_STATUS'; payload: string }
    | { type: 'SET_FILTER_DATE'; payload: string | null }
    | { type: 'SET_FILTER_SEARCH'; payload: string }
    | { type: 'CLEAR_FILTERS' }
    | { type: 'UPDATE_STATS' }

const initialState: AppointmentState = {
    appointments: [],
    services: [],
    loading: false,
    error: null,
    filters: {
        status: 'all',
        date: null,
        search: ''
    },
    stats: {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        upcoming: 0
    }
}

const calculateStats = (appointments: Appointment[]): AppointmentState['stats'] => {
    const today = new Date().toISOString().split('T')[0]

    return {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        upcoming: appointments.filter(a => a.date >= today && a.status !== 'cancelled').length
    }
}

const appointmentReducer = (state: AppointmentState, action: AppointmentAction): AppointmentState => {
    switch (action.type) {
        case 'SET_APPOINTMENTS':
            return {
                ...state,
                appointments: action.payload,
                stats: calculateStats(action.payload)
            }

        case 'SET_SERVICES':
            return {
                ...state,
                services: action.payload
            }

        case 'ADD_APPOINTMENT': {
            const newAppointments = [...state.appointments, action.payload]
            return {
                ...state,
                appointments: newAppointments,
                stats: calculateStats(newAppointments)
            }
        }

        case 'UPDATE_APPOINTMENT': {
            const newAppointments = state.appointments.map(apt =>
                apt.id === action.payload.id ? action.payload : apt
            )
            return {
                ...state,
                appointments: newAppointments,
                stats: calculateStats(newAppointments)
            }
        }

        case 'DELETE_APPOINTMENT': {
            const newAppointments = state.appointments.filter(apt => apt.id !== action.payload)
            return {
                ...state,
                appointments: newAppointments,
                stats: calculateStats(newAppointments)
            }
        }

        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            }

        case 'SET_FILTER_STATUS':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    status: action.payload
                }
            }

        case 'SET_FILTER_DATE':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    date: action.payload
                }
            }

        case 'SET_FILTER_SEARCH':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    search: action.payload
                }
            }

        case 'CLEAR_FILTERS':
            return {
                ...state,
                filters: {
                    status: 'all',
                    date: null,
                    search: ''
                }
            }

        case 'UPDATE_STATS':
            return {
                ...state,
                stats: calculateStats(state.appointments)
            }

        default:
            return state
    }
}

interface AppointmentContextType {
    state: AppointmentState
    dispatch: React.Dispatch<AppointmentAction>
    loadAppointments: () => Promise<void>
    loadServices: () => Promise<void>
    createAppointment: (data: any) => Promise<void>
    updateAppointment: (id: string, data: any) => Promise<void>
    deleteAppointment: (id: string) => Promise<void>
    changeStatus: (id: string, status: string) => Promise<void>
    getFilteredAppointments: () => Appointment[]
    getAppointmentsByDate: (date: string) => Appointment[]
    getAppointmentsByStatus: (status: string) => Appointment[]
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appointmentReducer, initialState)

    // Cargar datos iniciales
    useEffect(() => {
        loadAppointments()
        loadServices()

        // Suscripción en tiempo real
        const subscription = appointmentsService.subscribeToChanges((payload) => {
            console.log('Cambio en tiempo real:', payload)
            loadAppointments()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const loadAppointments = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            const data = await appointmentsService.getAll()
            dispatch({ type: 'SET_APPOINTMENTS', payload: data })
            dispatch({ type: 'SET_ERROR', payload: null })
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const loadServices = async () => {
        try {
            const data = await appointmentsService.getServices()
            dispatch({ type: 'SET_SERVICES', payload: data })
        } catch (error) {
            console.error('Error cargando servicios:', error)
        }
    }

    const createAppointment = async (data: any) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            const newAppointment = await appointmentsService.create(data)
            dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment })
            return newAppointment
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
            throw error
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const updateAppointment = async (id: string, data: any) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            const updated = await appointmentsService.update(id, data)
            dispatch({ type: 'UPDATE_APPOINTMENT', payload: updated })
            return updated
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
            throw error
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const deleteAppointment = async (id: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            await appointmentsService.delete(id)
            dispatch({ type: 'DELETE_APPOINTMENT', payload: id })
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
            throw error
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const changeStatus = async (id: string, status: string) => {
        try {
            await appointmentsService.changeStatus(id, status as any)
            await loadAppointments()
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
            throw error
        }
    }

    const getFilteredAppointments = (): Appointment[] => {
        return state.appointments.filter(apt => {
            // Filtro por estado
            if (state.filters.status !== 'all' && apt.status !== state.filters.status) {
                return false
            }

            // Filtro por fecha
            if (state.filters.date && apt.date !== state.filters.date) {
                return false
            }

            // Filtro por búsqueda (nombre o email)
            if (state.filters.search) {
                const searchLower = state.filters.search.toLowerCase()
                return apt.client_name.toLowerCase().includes(searchLower) ||
                    apt.client_email.toLowerCase().includes(searchLower)
            }

            return true
        })
    }

    const getAppointmentsByDate = (date: string): Appointment[] => {
        return state.appointments.filter(apt => apt.date === date)
    }

    const getAppointmentsByStatus = (status: string): Appointment[] => {
        return state.appointments.filter(apt => apt.status === status)
    }

    return (
        <AppointmentContext.Provider value={{
            state,
            dispatch,
            loadAppointments,
            loadServices,
            createAppointment,
            updateAppointment,
            deleteAppointment,
            changeStatus,
            getFilteredAppointments,
            getAppointmentsByDate,
            getAppointmentsByStatus
        }}>
            {children}
        </AppointmentContext.Provider>
    )
}

export const useAppointments = () => {
    const context = useContext(AppointmentContext)
    if (context === undefined) {
        throw new Error('useAppointments debe usarse dentro de AppointmentProvider')
    }
    return context
}