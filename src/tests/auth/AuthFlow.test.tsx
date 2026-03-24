import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import Login from '@/pages/Login/Login'
import Register from '@/pages/Register/Register'

// Mock de authService
vi.mock('@/services/supabase/auth', () => ({
    authService: {
        signIn: vi.fn(),
        signUp: vi.fn(),
        getCurrentUser: vi.fn(),
        signOut: vi.fn(),
        onAuthStateChange: vi.fn(() => ({
            data: { subscription: { unsubscribe: vi.fn() } }
        })),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
    }
}))

vi.mock('@/services/supabase/profiles', () => ({
    profilesService: {
        create: vi.fn(),
        getById: vi.fn(),
        getCurrentProfile: vi.fn(),
        update: vi.fn(),
    }
}))

describe('Flujo de Autenticación', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Login', () => {
        it('debe mostrar el formulario de login', () => {
            render(
                <BrowserRouter>
                    <AuthProvider>
                        <Login />
                    </AuthProvider>
                </BrowserRouter>
            )

            expect(screen.getByText('Bienvenido')).toBeInTheDocument()
            expect(screen.getByLabelText('Email')).toBeInTheDocument()
            expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
        })

        it('debe validar campos vacíos', async () => {
            render(
                <BrowserRouter>
                    <AuthProvider>
                        <Login />
                    </AuthProvider>
                </BrowserRouter>
            )

            fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

            await waitFor(() => {
                expect(screen.getByText(/email es requerido/i)).toBeInTheDocument()
                expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument()
            })
        })

        it('debe mostrar error con credenciales inválidas', async () => {
            const { authService } = await import('@/services/supabase/auth')

            // IMPORTANTE: El error debe ser un objeto Error
            authService.signIn.mockRejectedValueOnce(new Error('Credenciales inválidas'))

            render(
                <BrowserRouter>
                    <AuthProvider>
                        <Login />
                    </AuthProvider>
                </BrowserRouter>
            )

            fireEvent.change(screen.getByLabelText('Email'), {
                target: { value: 'test@test.com' }
            })
            fireEvent.change(screen.getByLabelText('Contraseña'), {
                target: { value: 'wrongpass' }
            })

            fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

            // Esperar a que aparezca el mensaje de error
            await waitFor(() => {
                expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument()
            })
        })
    })

    describe('Register', () => {
        it('debe mostrar el formulario de registro', () => {
            render(
                <BrowserRouter>
                    <AuthProvider>
                        <Register />
                    </AuthProvider>
                </BrowserRouter>
            )

            expect(screen.getByText('Crear Cuenta')).toBeInTheDocument()
            expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
            expect(screen.getByLabelText('Email')).toBeInTheDocument()
            expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
            expect(screen.getByLabelText('Confirmar Contraseña')).toBeInTheDocument()
        })

        it('debe validar que las contraseñas coincidan', async () => {
            render(
                <BrowserRouter>
                    <AuthProvider>
                        <Register />
                    </AuthProvider>
                </BrowserRouter>
            )

            fireEvent.change(screen.getByLabelText('Nombre'), {
                target: { value: 'Test User' }
            })
            fireEvent.change(screen.getByLabelText('Email'), {
                target: { value: 'test@test.com' }
            })
            fireEvent.change(screen.getByLabelText('Contraseña'), {
                target: { value: 'password123' }
            })
            fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), {
                target: { value: 'password456' }
            })
            fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))

            await waitFor(() => {
                expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
            })
        })
    })
})