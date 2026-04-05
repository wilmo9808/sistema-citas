import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import PrivateRoute from '@/components/auth/PrivateRoute'

vi.mock('@/services/supabase/auth', () => ({
    authService: {
        getCurrentUser: vi.fn(),
        onAuthStateChange: vi.fn(() => ({
            data: { subscription: { unsubscribe: vi.fn() } }
        })),
    }
}))

describe('Rutas Protegidas', () => {
    it('debe redirigir a login si no hay usuario', async () => {
        const { authService } = await import('@/services/supabase/auth')
        vi.mocked(authService.getCurrentUser).mockResolvedValue(null)

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<div>Login Page</div>} />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <div>Dashboard Privado</div>
                            </PrivateRoute>
                        } />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Login Page')).toBeInTheDocument()
        })
    })

    it('debe mostrar dashboard si hay usuario', async () => {
        const { authService } = await import('@/services/supabase/auth')
        vi.mocked(authService.getCurrentUser).mockResolvedValue({
            id: '123',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            email: 'test@test.com',
            role: 'authenticated'
        } as any)

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <div>Dashboard Privado</div>
                            </PrivateRoute>
                        } />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Dashboard Privado')).toBeInTheDocument()
        })
    })
})