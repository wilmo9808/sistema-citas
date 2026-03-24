import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { authService } from '@/services/supabase/auth'
import styles from './Login.module.css'

interface LoginForm {
    email: string
    password: string
}

const schema = yup.object({
    email: yup.string()
        .required('El email es requerido')
        .email('Email inválido'),
    password: yup.string()
        .required('La contraseña es requerida')
        .min(6, 'Mínimo 6 caracteres')
})

const Login: React.FC = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data: LoginForm) => {
        try {
            setLoading(true)
            setError(null)
            await authService.signIn(data.email, data.password)
            navigate('/dashboard')
        } catch (error: any) {
            setError(error.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Bienvenido</h1>
                <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>

                {error && (
                    <div className={styles.errorAlert}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`${styles.input} ${errors.email ? styles.error : ''}`}
                            placeholder="tu@email.com"
                            {...register('email')}
                            disabled={loading}
                        />
                        {errors.email && (
                            <span className={styles.errorMessage}>{errors.email.message}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`${styles.input} ${errors.password ? styles.error : ''}`}
                            placeholder="••••••"
                            {...register('password')}
                            disabled={loading}
                        />
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className={styles.registerLink}>
                    ¿No tienes cuenta?{' '}
                    <Link to="/register">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    )
}

export default Login