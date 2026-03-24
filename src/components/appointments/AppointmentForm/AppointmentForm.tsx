import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Database } from '@/types/supabase'
import { appointmentsService } from '@/services/supabase/appointments'
import { patientsService } from '@/services/supabase/patients'
import { Patient } from '@/types/patients'
import PatientSelector from '@/components/patients/PatientSelector'
import styles from './AppointmentForm.module.css'

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
type Service = Database['public']['Tables']['services']['Row']

interface AppointmentFormProps {
    initialData?: Partial<AppointmentInsert> & { id?: string; patient_id?: string }
    onSuccess: () => void
    onCancel: () => void
}

const schema = yup.object({
    client_name: yup.string()
        .required('El nombre es requerido')
        .min(3, 'Mínimo 3 caracteres'),
    client_email: yup.string()
        .required('El email es requerido')
        .email('Email inválido'),
    date: yup.string()
        .required('La fecha es requerida'),
    time: yup.string()
        .required('La hora es requerida'),
    service_id: yup.string()
        .required('El servicio es requerido'),
    notes: yup.string()
        .nullable()
})

const AppointmentForm: React.FC<AppointmentFormProps> = ({
    initialData,
    onSuccess,
    onCancel
}) => {
    const [services, setServices] = useState<Service[]>([])
    const [patients, setPatients] = useState<Patient[]>([])
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [loading, setLoading] = useState(false)
    const [loadingPatients, setLoadingPatients] = useState(true)
    const [creatingPatient, setCreatingPatient] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            client_name: initialData?.client_name || '',
            client_email: initialData?.client_email || '',
            date: initialData?.date || '',
            time: initialData?.time || '',
            service_id: initialData?.service_id || '',
            notes: initialData?.notes || ''
        }
    })

    useEffect(() => {
        loadServices()
        loadPatients()

        // Si hay datos iniciales y tiene patient_id, cargar ese paciente
        if (initialData?.patient_id) {
            loadPatientById(initialData.patient_id)
        }

        if (initialData) {
            setValue('client_name', initialData.client_name || '')
            setValue('client_email', initialData.client_email || '')
            setValue('date', initialData.date || '')
            setValue('time', initialData.time || '')
            setValue('service_id', initialData.service_id || '')
            setValue('notes', initialData.notes || '')
        }
    }, [initialData, setValue])

    const loadPatientById = async (patientId: string) => {
        try {
            const patient = await patientsService.getById(patientId)
            setSelectedPatient(patient)
            setValue('client_name', patient.name)
            setValue('client_email', patient.email || '')
        } catch (error) {
            console.error('Error cargando paciente:', error)
        }
    }

    const loadServices = async () => {
        try {
            const data = await appointmentsService.getServices()
            setServices(data)
        } catch (error) {
            console.error('Error cargando servicios:', error)
        }
    }

    const loadPatients = async () => {
        try {
            setLoadingPatients(true)
            const data = await patientsService.getAll()
            setPatients(data)
        } catch (error) {
            console.error('Error cargando pacientes:', error)
        } finally {
            setLoadingPatients(false)
        }
    }

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient)
        setValue('client_name', patient.name)
        setValue('client_email', patient.email || '')
    }

    // Función para crear o buscar paciente por nombre/email
    const getOrCreatePatient = async (name: string, email: string): Promise<string | null> => {
        if (!name.trim()) return null

        // Si ya hay paciente seleccionado, usarlo
        if (selectedPatient) return selectedPatient.id

        // Buscar si ya existe un paciente con ese nombre o email
        const existingPatient = patients.find(p =>
            p.name.toLowerCase() === name.toLowerCase() ||
            (email && p.email?.toLowerCase() === email.toLowerCase())
        )

        if (existingPatient) {
            setSelectedPatient(existingPatient)
            return existingPatient.id
        }

        // Si no existe, crear nuevo paciente
        try {
            setCreatingPatient(true)
            const newPatient = await patientsService.create({
                name: name.trim(),
                email: email.trim() || null,
                phone: null,
                sexo: null,
                edad: null,
                documento: null,
                peso: null,
                estatura: null
            })
            setSelectedPatient(newPatient)
            // Actualizar lista de pacientes
            await loadPatients()
            return newPatient.id
        } catch (error) {
            console.error('Error creando paciente:', error)
            return null
        } finally {
            setCreatingPatient(false)
        }
    }

    const onSubmit = async (data: any) => {
        try {
            setLoading(true)

            // Crear o buscar paciente basado en los datos ingresados
            const patientId = await getOrCreatePatient(data.client_name, data.client_email)

            const appointmentData = {
                client_name: data.client_name,
                client_email: data.client_email,
                date: data.date,
                time: data.time,
                service_id: data.service_id,
                notes: data.notes || null,
                patient_id: patientId
            }

            if (initialData?.id) {
                await appointmentsService.update(initialData.id, appointmentData)
                console.log('✅ Cita actualizada correctamente')
            } else {
                await appointmentsService.create(appointmentData)
                console.log('✅ Cita creada correctamente con paciente:', patientId)
            }

            onSuccess()
            reset()
            setSelectedPatient(null)
        } catch (error) {
            console.error('Error guardando cita:', error)
            alert('Error al guardar la cita')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2 className={styles.title}>
                {initialData?.id ? 'Editar Cita' : 'Nueva Cita'}
            </h2>

            {/* Selector de pacientes */}
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Buscar paciente existente
                </label>
                {loadingPatients ? (
                    <div className={styles.loadingPatients}>Cargando pacientes...</div>
                ) : (
                    <PatientSelector
                        patients={patients}
                        selectedPatient={selectedPatient}
                        onSelect={handleSelectPatient}
                        onPatientCreated={loadPatients}
                    />
                )}
            </div>

            {/* Separador */}
            <div className={styles.separator}>
                <span>O ingresa los datos del nuevo paciente</span>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="client_name" className={styles.label}>
                    Nombre completo *
                </label>
                <input
                    type="text"
                    id="client_name"
                    className={`${styles.input} ${errors.client_name ? styles.error : ''}`}
                    placeholder="Ej: Juan Pérez"
                    {...register('client_name')}
                    disabled={loading || creatingPatient}
                />
                {errors.client_name && (
                    <span className={styles.errorMessage}>{errors.client_name.message}</span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="client_email" className={styles.label}>
                    Email
                </label>
                <input
                    type="email"
                    id="client_email"
                    className={`${styles.input} ${errors.client_email ? styles.error : ''}`}
                    placeholder="Ej: juan@email.com"
                    {...register('client_email')}
                    disabled={loading || creatingPatient}
                />
                {errors.client_email && (
                    <span className={styles.errorMessage}>{errors.client_email.message}</span>
                )}
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label htmlFor="date" className={styles.label}>
                        Fecha *
                    </label>
                    <input
                        type="date"
                        id="date"
                        className={`${styles.input} ${errors.date ? styles.error : ''}`}
                        {...register('date')}
                        disabled={loading}
                    />
                    {errors.date && (
                        <span className={styles.errorMessage}>{errors.date.message}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="time" className={styles.label}>
                        Hora *
                    </label>
                    <input
                        type="time"
                        id="time"
                        className={`${styles.input} ${errors.time ? styles.error : ''}`}
                        {...register('time')}
                        disabled={loading}
                    />
                    {errors.time && (
                        <span className={styles.errorMessage}>{errors.time.message}</span>
                    )}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="service_id" className={styles.label}>
                    Servicio *
                </label>
                <select
                    id="service_id"
                    className={`${styles.select} ${errors.service_id ? styles.error : ''}`}
                    {...register('service_id')}
                    disabled={loading}
                >
                    <option value="">Seleccione un servicio</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name} - {service.duration}min - ${service.price}
                        </option>
                    ))}
                </select>
                {errors.service_id && (
                    <span className={styles.errorMessage}>{errors.service_id.message}</span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="notes" className={styles.label}>
                    Notas (opcional)
                </label>
                <textarea
                    id="notes"
                    className={styles.textarea}
                    rows={3}
                    placeholder="Notas adicionales..."
                    {...register('notes')}
                    disabled={loading}
                />
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
                    disabled={loading || creatingPatient}
                >
                    {loading ? 'Guardando...' : (initialData?.id ? 'Actualizar' : 'Crear Cita')}
                </button>
            </div>

            {creatingPatient && (
                <div className={styles.creatingMessage}>
                    Creando paciente...
                </div>
            )}
        </form>
    )
}

export default AppointmentForm