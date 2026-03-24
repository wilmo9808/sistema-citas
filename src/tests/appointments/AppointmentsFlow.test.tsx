import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { AppointmentProvider } from '@/context/AppointmentContext/AppointmentContext'
import Appointments from '@/pages/Appointments/Appointments'

// Mocks DIRECTOS - SIN variables externas
vi.mock('@/services/supabase/auth', () => ({
    authService: {
        getCurrentUser: vi.fn().mockResolvedValue({ id: '123', email: 'test@test.com' }),
        onAuthStateChange: vi.fn(() => ({
            data: { subscription: { unsubscribe: vi.fn() } }
        })),
    }
}))

// Datos mock definidos DENTRO del mock
vi.mock('@/services/supabase/appointments', () => {
    const mockAppointments = [
        {
            id: '1',
            client_name: 'Juan Pérez',
            client_email: 'juan@test.com',
            date: '2024-03-20',
            time: '10:00',
            service_name: 'Consulta',
            status: 'pending',
            user_id: '123'
        },
        {
            id: '2',
            client_name: 'María García',
            client_email: 'maria@test.com',
            date: '2024-03-21',
            time: '15:30',
            service_name: 'Revisión',
            status: 'confirmed',
            user_id: '123'
        }
    ]

    return {
        appointmentsService: {
            getAll: vi.fn().mockResolvedValue(mockAppointments),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            getById: vi.fn(),
            getByDate: vi.fn(),
            getByStatus: vi.fn(),
            getUpcoming: vi.fn(),
            changeStatus: vi.fn(),
            getServices: vi.fn().mockResolvedValue([
                { id: '1', name: 'Consulta', duration: 30, price: 50 }
            ]),
            subscribeToChanges: vi.fn(() => ({ unsubscribe: vi.fn() })),
        }
    }
})

vi.mock('@/services/supabase/profiles', () => ({
    profilesService: {
        getById: vi.fn(),
        getCurrentProfile: vi.fn().mockResolvedValue({
            id: '123',
            name: 'Test User',
            email: 'test@test.com',
            role: 'user'
        }),
    }
}))

describe('Flujo de Citas', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('debe cargar y mostrar la lista de citas', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <AppointmentProvider>
                        <Appointments />
                    </AppointmentProvider>
                </AuthProvider>
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
            expect(screen.getByText('María García')).toBeInTheDocument()
        })
    })

    it('debe filtrar citas por estado', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <AppointmentProvider>
                        <Appointments />
                    </AppointmentProvider>
                </AuthProvider>
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })

        const filterButton = screen.getByRole('button', { name: /confirmadas/i })
        fireEvent.click(filterButton)

        await waitFor(() => {
            expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument()
            expect(screen.getByText('María García')).toBeInTheDocument()
        })
    })

    it('debe abrir modal para nueva cita', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <AppointmentProvider>
                        <Appointments />
                    </AppointmentProvider>
                </AuthProvider>
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })

        // HAY DOS BOTONES "NUEVA CITA" - USAR EL PRIMERO
        const newButtons = screen.getAllByRole('button', { name: /nueva cita/i })
        fireEvent.click(newButtons[0]) // Click en el primer botón

        // Esperar a que el modal aparezca
        await waitFor(() => {
            expect(screen.getByText(/nueva cita/i, { selector: 'h2' })).toBeInTheDocument()
        })
    })
})