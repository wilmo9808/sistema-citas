import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { appointmentsService } from '@/services/supabase/appointments'
import { authService } from '@/services/supabase/auth'
import { profilesService } from '@/services/supabase/profiles'
import { Database } from '@/types/supabase'
import styles from './Dashboard.module.css'

type Appointment = Database['public']['Tables']['appointments']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

const Dashboard: React.FC = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        upcoming: 0
    })
    const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setLoading(true)

            // Cargar perfil
            const userProfile = await profilesService.getCurrentProfile()
            setProfile(userProfile)

            // Cargar todas las citas
            const appointments = await appointmentsService.getAll()

            // Calcular estadísticas
            const today = new Date().toISOString().split('T')[0]

            setStats({
                total: appointments.length,
                pending: appointments.filter(a => a.status === 'pending').length,
                confirmed: appointments.filter(a => a.status === 'confirmed').length,
                completed: appointments.filter(a => a.status === 'completed').length,
                cancelled: appointments.filter(a => a.status === 'cancelled').length,
                upcoming: appointments.filter(a => a.date >= today && a.status !== 'cancelled').length
            })

            // Últimas 5 citas
            setRecentAppointments(appointments.slice(0, 5))
        } catch (error) {
            console.error('Error cargando dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await authService.signOut()
            navigate('/login')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Cargando dashboard...</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.welcome}>
                        ¡Hola, {profile?.name || 'Usuario'}!
                    </h1>
                    <p className={styles.subtitle}>
                        Aquí está el resumen de tus citas
                    </p>
                </div>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>

            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.total}`}>
                    <span className={styles.statValue}>{stats.total}</span>
                    <span className={styles.statLabel}>Total Citas</span>
                </div>
                <div className={`${styles.statCard} ${styles.pending}`}>
                    <span className={styles.statValue}>{stats.pending}</span>
                    <span className={styles.statLabel}>Pendientes</span>
                </div>
                <div className={`${styles.statCard} ${styles.confirmed}`}>
                    <span className={styles.statValue}>{stats.confirmed}</span>
                    <span className={styles.statLabel}>Confirmadas</span>
                </div>
                <div className={`${styles.statCard} ${styles.upcoming}`}>
                    <span className={styles.statValue}>{stats.upcoming}</span>
                    <span className={styles.statLabel}>Próximas</span>
                </div>
            </div>

            <div className={styles.recentSection}>
                <div className={styles.sectionHeader}>
                    <h2>Citas Recientes</h2>
                    <button
                        className={styles.viewAllButton}
                        onClick={() => navigate('/appointments')}
                    >
                        Ver todas <ArrowRight size={16} style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                    </button>
                </div>

                {recentAppointments.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No hay citas recientes</p>
                        <button
                            className={styles.createButton}
                            onClick={() => navigate('/appointments')}
                        >
                            Crear primera cita
                        </button>
                    </div>
                ) : (
                    <div className={styles.recentList}>
                        {recentAppointments.map(appointment => (
                            <div key={appointment.id} className={styles.recentItem}>
                                <div className={styles.recentInfo}>
                                    <span className={styles.clientName}>
                                        {appointment.client_name}
                                    </span>
                                    <span className={styles.serviceName}>
                                        {appointment.service_name}
                                    </span>
                                    <span className={styles.dateTime}>
                                        {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                                    </span>
                                </div>
                                <span className={`${styles.status} ${styles[appointment.status]}`}>
                                    {appointment.status === 'pending' && 'Pendiente'}
                                    {appointment.status === 'confirmed' && 'Confirmada'}
                                    {appointment.status === 'completed' && 'Completada'}
                                    {appointment.status === 'cancelled' && 'Cancelada'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.quickActions}>
                <button
                    className={styles.actionButton}
                    onClick={() => navigate('/appointments')}
                >
                    Gestionar Citas
                </button>
                <button
                    className={styles.actionButton}
                    onClick={() => navigate('/appointments?new=true')}
                >
                    Nueva Cita
                </button>
            </div>
        </div>
    )
}

export default Dashboard