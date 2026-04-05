import React, { useState, useEffect } from 'react'
import AppointmentCard from '../AppointmentCard/AppointmentCard'
import AppointmentForm from '../AppointmentForm/AppointmentForm'
import AppointmentModal from '../AppointmentModal/AppointmentModal'
import { appointmentsService } from '@/services/supabase/appointments'
import { Database } from '@/types/supabase'
import styles from './AppointmentList.module.css'

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
    services?: {
        name: string
        duration: number
        price: number
    }
}

const AppointmentList: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

    useEffect(() => {
        loadAppointments()
    }, [])

    const loadAppointments = async () => {
        try {
            setLoading(true)
            const data = await appointmentsService.getAll()
            setAppointments(data)
        } catch (error) {
            console.error('Error cargando citas:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await appointmentsService.delete(id)
            await loadAppointments()
        } catch (error) {
            console.error('Error eliminando cita:', error)
            alert('Error al eliminar la cita')
        }
    }

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await appointmentsService.changeStatus(id, status as any)
            await loadAppointments()
        } catch (error) {
            console.error('Error cambiando estado:', error)
        }
    }

    const handleEdit = (appointment: Appointment) => {
        setEditingAppointment(appointment)
        setModalOpen(true)
    }

    const handleSuccess = () => {
        loadAppointments()
        setModalOpen(false)
        setEditingAppointment(null)
    }

    const filteredAppointments = appointments.filter(apt => {
        if (filter === 'all') return true
        return apt.status === filter
    })

    const getFilterCount = (status: string) => {
        if (status === 'all') return appointments.length
        return appointments.filter(apt => apt.status === status).length
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Mis Citas</h2>
                <button
                    className={styles.newButton}
                    onClick={() => {
                        setEditingAppointment(null)
                        setModalOpen(true)
                    }}
                >
                    + Nueva Cita
                </button>
            </div>

            <div className={styles.filters}>
                <button
                    className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todas ({getFilterCount('all')})
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'pending' ? styles.active : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pendientes ({getFilterCount('pending')})
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'confirmed' ? styles.active : ''}`}
                    onClick={() => setFilter('confirmed')}
                >
                    Confirmadas ({getFilterCount('confirmed')})
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completadas ({getFilterCount('completed')})
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'cancelled' ? styles.active : ''}`}
                    onClick={() => setFilter('cancelled')}
                >
                    Canceladas ({getFilterCount('cancelled')})
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Cargando citas...</p>
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className={styles.empty}>
                    <p>No hay citas {filter !== 'all' ? 'en este estado' : ''}</p>
                    <button
                        className={styles.emptyButton}
                        onClick={() => {
                            setEditingAppointment(null)
                            setModalOpen(true)
                        }}
                    >
                        Crear primera cita
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredAppointments.map(appointment => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            <AppointmentModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setEditingAppointment(null)
                }}
            >
                <AppointmentForm
                    initialData={editingAppointment ? { ...editingAppointment, patient_id: editingAppointment.patient_id || undefined } : undefined}
                    onSuccess={handleSuccess}
                    onCancel={() => {
                        setModalOpen(false)
                        setEditingAppointment(null)
                    }}
                />
            </AppointmentModal>
        </div>
    )
}

export default AppointmentList