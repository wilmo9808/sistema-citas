import React from 'react'
import { Database } from '@/types/supabase'
import styles from './AppointmentCard.module.css'

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
    services?: {
        name: string
        duration: number
        price: number
    }
}

interface AppointmentCardProps {
    appointment: Appointment
    onEdit: (appointment: Appointment) => void
    onDelete: (id: string) => void
    onStatusChange: (id: string, status: string) => void
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    onEdit,
    onDelete,
    onStatusChange
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return styles.confirmed
            case 'pending': return styles.pending
            case 'cancelled': return styles.cancelled
            case 'completed': return styles.completed
            default: return ''
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Confirmada'
            case 'pending': return 'Pendiente'
            case 'cancelled': return 'Cancelada'
            case 'completed': return 'Completada'
            default: return status
        }
    }

    return (
        <div className={`${styles.card} ${getStatusColor(appointment.status)}`}>
            <div className={styles.header}>
                <h3 className={styles.clientName}>{appointment.client_name}</h3>
                <span className={styles.status}>
                    {getStatusText(appointment.status)}
                </span>
            </div>

            <div className={styles.details}>
                <div className={styles.detail}>
                    <span className={styles.label}> Email:</span>
                    <span className={styles.value}>{appointment.client_email}</span>
                </div>

                <div className={styles.detail}>
                    <span className={styles.label}> Fecha:</span>
                    <span className={styles.value}>
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                <div className={styles.detail}>
                    <span className={styles.label}> Hora:</span>
                    <span className={styles.value}>{appointment.time}</span>
                </div>

                <div className={styles.detail}>
                    <span className={styles.label}> Servicio:</span>
                    <span className={styles.value}>
                        {appointment.service_name}
                        {appointment.services && (
                            <span className={styles.serviceInfo}>
                                ({appointment.services.duration}min - ${appointment.services.price})
                            </span>
                        )}
                    </span>
                </div>

                {appointment.notes && (
                    <div className={styles.detail}>
                        <span className={styles.label}> Notas:</span>
                        <span className={styles.value}>{appointment.notes}</span>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <select
                    className={styles.statusSelect}
                    value={appointment.status}
                    onChange={(e) => onStatusChange(appointment.id, e.target.value)}
                >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                </select>

                <div className={styles.buttonGroup}>
                    <button
                        className={styles.editButton}
                        onClick={() => onEdit(appointment)}
                    >
                        Editar
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={() => {
                            if (window.confirm('¿Eliminar esta cita?')) {
                                onDelete(appointment.id)
                            }
                        }}
                    >
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AppointmentCard