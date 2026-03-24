import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { authService } from '@/services/supabase/auth'
import styles from './Register.module.css'

interface RegisterForm {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const schema = yup.object({
    name: yup.string()
        .required('El nombre es requerido')
        .min(3, 'Mínimo 3 caracteres'),
    email: yup.string()
        .required('El email es requerido')
        .email('Email inválido'),
    password: yup.string()
        .required('La contraseña es requerida')
        .min(6, 'Mínimo 6 caracteres'),
    confirmPassword: yup.string()
        .required('Confirma tu contraseña')
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
})

const Register: React.FC = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data: RegisterForm) => {
        try {
            setLoading(true)
            setError(null)
            await authService.signUp(data.email, data.password, data.name)
            navigate('/dashboard')
        } catch (error: any) {
            setError(error.message || 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Crear Cuenta</h1>
                <p className={styles.subtitle}>Regístrate para comenzar</p>

                {error && (
                    <div className={styles.errorAlert}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            className={`${styles.input} ${errors.name ? styles.error : ''}`}
                            placeholder="Tu nombre"
                            {...register('name')}
                            disabled={loading}
                        />
                        {errors.name && (
                            <span className={styles.errorMessage}>{errors.name.message}</span>
                        )}
                    </div>

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

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                            placeholder="••••••"
                            {...register('confirmPassword')}
                            disabled={loading}
                        />
                        {errors.confirmPassword && (
                            <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <p className={styles.loginLink}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}

export default Register