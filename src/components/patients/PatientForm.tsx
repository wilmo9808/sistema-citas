import React, { useState } from 'react'
import { Patient, PatientFormData } from '@/types/patients'
import styles from './PatientForm.module.css'

interface PatientFormProps {
    initialData?: Patient
    onSubmit: (data: PatientFormData) => Promise<void>
    onCancel: () => void
    title: string
}

const PatientForm: React.FC<PatientFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    title
}) => {
    const [formData, setFormData] = useState<PatientFormData>({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        sexo: initialData?.sexo || null,
        edad: initialData?.edad || null,
        documento: initialData?.documento || '',
        peso: initialData?.peso || null,
        estatura: initialData?.estatura || null
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? null : value
        }))
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!formData.name?.trim()) {
            newErrors.name = 'El nombre es requerido'
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }
        if (formData.edad && (formData.edad < 0 || formData.edad > 120)) {
            newErrors.edad = 'Edad entre 0 y 120 años'
        }
        if (formData.peso && (formData.peso < 0 || formData.peso > 500)) {
            newErrors.peso = 'Peso inválido'
        }
        if (formData.estatura && (formData.estatura < 0 || formData.estatura > 300)) {
            newErrors.estatura = 'Estatura inválida'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            await onSubmit(formData)
        } catch (error) {
            console.error('Error:', error)
            alert('Error al guardar el paciente')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.title}>{title}</h3>

            <div className={styles.formGroup}>
                <label className={styles.label}>Nombre completo *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.name ? styles.error : ''}`}
                    disabled={loading}
                />
                {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.email ? styles.error : ''}`}
                        disabled={loading}
                    />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Teléfono</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Documento</label>
                    <input
                        type="text"
                        name="documento"
                        value={formData.documento || ''}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="CC, TI, etc."
                        disabled={loading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Sexo</label>
                    <select
                        name="sexo"
                        value={formData.sexo || ''}
                        onChange={handleChange}
                        className={styles.select}
                        disabled={loading}
                    >
                        <option value="">Seleccionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Edad (años)</label>
                    <input
                        type="number"
                        name="edad"
                        value={formData.edad || ''}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.edad ? styles.error : ''}`}
                        min="0"
                        max="120"
                        disabled={loading}
                    />
                    {errors.edad && <span className={styles.errorMessage}>{errors.edad}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Peso (kg)</label>
                    <input
                        type="number"
                        name="peso"
                        value={formData.peso || ''}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.peso ? styles.error : ''}`}
                        step="0.1"
                        min="0"
                        max="500"
                        disabled={loading}
                    />
                    {errors.peso && <span className={styles.errorMessage}>{errors.peso}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Estatura (cm)</label>
                    <input
                        type="number"
                        name="estatura"
                        value={formData.estatura || ''}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.estatura ? styles.error : ''}`}
                        step="0.1"
                        min="0"
                        max="300"
                        disabled={loading}
                    />
                    {errors.estatura && <span className={styles.errorMessage}>{errors.estatura}</span>}
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Paciente'}
                </button>
            </div>
        </form>
    )
}

export default PatientForm