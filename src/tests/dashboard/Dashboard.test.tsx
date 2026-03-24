import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { AppointmentProvider } from '@/context/AppointmentContext/AppointmentContext'
import Dashboard from '@/pages/Dashboard/Dashboard'

vi.mock('@/services/supabase/auth', () => ({
    authService: {
        getCurrentUser: vi.fn().mockResolvedValue({ id: '123', email: 'test@test.com' }),
        onAuthStateChange: vi.fn(() => ({
            data: { subscription: { unsubscribe: vi.fn() } }
        })),
        signOut: vi.fn(),
    }
}))

vi.mock('@/services/supabase/profiles', () => ({
    profilesService: {
        getCurrentProfile: vi.fn().mockResolvedValue({
            id: '123',
            name: 'Test User',
            email: 'test@test.com',
            role: 'user'
        }),
        getById: vi.fn(),
    }
}))

vi.mock('@/services/supabase/appointments', () => ({
    appointmentsService: {
        getAll: vi.fn().mockResolvedValue([
            { id: '1', client_name: 'Juan', service_name: 'Consulta', date: '2024-03-19', time: '10:00', status: 'pending' },
            { id: '2', client_name: 'María', service_name: 'Revisión', date: '2024-03-20', time: '11:00', status: 'confirmed' },
            { id: '3', client_name: 'Carlos', service_name: 'Terapia', date: '2024-03-18', time: '12:00', status: 'completed' },
        ]),
        subscribeToChanges: vi.fn(() => ({ unsubscribe: vi.fn() })),
        getServices: vi.fn().mockResolvedValue([]),
    }
}))

describe('Dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('debe mostrar bienvenida y estadísticas', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <AppointmentProvider>
                        <Dashboard />
                    </AppointmentProvider>
                </AuthProvider>
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(screen.getByText(/hola, test user/i)).toBeInTheDocument()
        })

        // Usar getAllByText para manejar múltiples elementos con "1"
        expect(screen.getByText('3')).toBeInTheDocument() // Total
        expect(screen.getAllByText('1')).toHaveLength(2) // Pendientes y Confirmadas (ambos valen 1)
        expect(screen.getByText('0')).toBeInTheDocument() // Próximas
    })
})