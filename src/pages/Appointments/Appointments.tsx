import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppointmentList from '@/components/appointments/AppointmentList/AppointmentList'
import AppointmentForm from '@/components/appointments/AppointmentForm/AppointmentForm'
import AppointmentModal from '@/components/appointments/AppointmentModal/AppointmentModal'
import styles from './Appointments.module.css'

const Appointments: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [showNewModal, setShowNewModal] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        // Detectar si viene con ?new=true
        const params = new URLSearchParams(location.search)
        if (params.get('new') === 'true') {
            setShowNewModal(true)
            // Limpiar URL
            navigate('/appointments', { replace: true })
        }
    }, [location])

    // refrescar la lista después de crear
    const handleSuccess = () => {
        setShowNewModal(false)
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gestión de Citas</h1>
                <button
                    className={styles.newButton}
                    onClick={() => setShowNewModal(true)}
                >
                    + Nueva Cita
                </button>
            </div>

            {/* 👈 PASAR key para forzar refresco */}
            <AppointmentList key={refreshKey} />

            <AppointmentModal
                isOpen={showNewModal}
                onClose={() => setShowNewModal(false)}
            >
                <AppointmentForm
                    onSuccess={handleSuccess}
                    onCancel={() => setShowNewModal(false)}
                />
            </AppointmentModal>
        </div>
    )
}

export default Appointments