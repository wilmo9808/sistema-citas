import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppointments } from '@/context/AppointmentContext/AppointmentContext'

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
    notes: yup.string().nullable()
})

interface UseAppointmentFormProps {
    initialData?: any
    onSuccess?: () => void
}

export const useAppointmentForm = ({ initialData, onSuccess }: UseAppointmentFormProps = {}) => {
    const [loading, setLoading] = useState(false)
    const { createAppointment, updateAppointment, state } = useAppointments()

    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialData || {
            client_name: '',
            client_email: '',
            date: '',
            time: '',
            service_id: '',
            notes: ''
        }
    })

    const onSubmit = async (data: any) => {
        try {
            setLoading(true)
            if (initialData?.id) {
                await updateAppointment(initialData.id, data)
            } else {
                await createAppointment(data)
            }
            form.reset()
            onSuccess?.()
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return {
        ...form,
        onSubmit: form.handleSubmit(onSubmit),
        loading,
        services: state.services,
        isEditing: !!initialData?.id
    }
}