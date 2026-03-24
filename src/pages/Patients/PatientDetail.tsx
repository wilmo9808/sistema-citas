import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { patientsService } from '@/services/supabase/patients'
import { appointmentsService } from '@/services/supabase/appointments'
import { storageService } from '@/services/supabase/storage'
import { Patient } from '@/types/patients'
import { Database } from '@/types/supabase'
import PatientForm from '@/components/patients/PatientForm'
import styles from './PatientDetail.module.css'

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
    patients?: { name: string }
}

const PatientDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [patient, setPatient] = useState<Patient | null>(null)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [documents, setDocuments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'info' | 'citas' | 'documentos'>('info')
    const [showEditForm, setShowEditForm] = useState(false)

    useEffect(() => {
        if (user && id) {
            loadData()
        }
    }, [user, id])

    const loadData = async () => {
        if (!id) return
        try {
            setLoading(true)
            const patientData = await patientsService.getById(id)
            setPatient(patientData)

            const allAppointments = await appointmentsService.getAll()
            const patientAppointments = allAppointments.filter(
                apt => apt.patient_id === id
            )
            setAppointments(patientAppointments)

            const patientDocuments = await storageService.getPatientDocuments(id)
            setDocuments(patientDocuments)
        } catch (error) {
            console.error('Error cargando datos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (data: any) => {
        if (id) {
            await patientsService.update(id, data)
            setShowEditForm(false)
            await loadData()
        }
    }

    const handleDelete = async () => {
        if (confirm('¿Eliminar este paciente? Se eliminarán también sus citas y documentos.')) {
            try {
                await patientsService.delete(id!)
                navigate('/patients')
            } catch (error) {
                console.error('Error eliminando:', error)
                alert('Error al eliminar el paciente')
            }
        }
    }

    const getSexoText = (sexo: string | null) => {
        if (sexo === 'M') return 'Masculino'
        if (sexo === 'F') return 'Femenino'
        if (sexo === 'Otro') return 'Otro'
        return 'No especificado'
    }

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Cargando...</p>
            </div>
        )
    }

    if (!patient) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>Paciente no encontrado</p>
                    <button onClick={() => navigate('/patients')}>
                        Volver a pacientes
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/patients')}>
                    ← Volver
                </button>
                <div className={styles.patientInfo}>
                    <h1 className={styles.name}>{patient.name}</h1>
                </div>
                <div className={styles.actions}>
                    <button className={styles.editButton} onClick={() => setShowEditForm(true)}>
                        Editar
                    </button>
                    <button className={styles.deleteButton} onClick={handleDelete}>
                        🗑️ Eliminar
                    </button>
                    <button className={styles.actionButton} onClick={() => navigate(`/appointments?patient=${id}`)}>
                        Nueva Cita
                    </button>
                </div>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    Información
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'citas' ? styles.active : ''}`}
                    onClick={() => setActiveTab('citas')}
                >
                    Citas ({appointments.length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'documentos' ? styles.active : ''}`}
                    onClick={() => setActiveTab('documentos')}
                >
                    Documentos ({documents.length})
                </button>
            </div>

            {activeTab === 'info' && (
                <div className={styles.tabContent}>
                    {showEditForm ? (
                        <PatientForm
                            title="Editar Paciente"
                            initialData={patient}
                            onSubmit={handleUpdate}
                            onCancel={() => setShowEditForm(false)}
                        />
                    ) : (
                        <div className={styles.infoCard}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Nombre:</span>
                                <span className={styles.infoValue}>{patient.name}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Documento:</span>
                                <span className={styles.infoValue}>{patient.documento || 'No registrado'}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Sexo:</span>
                                <span className={styles.infoValue}>{getSexoText(patient.sexo)}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Edad:</span>
                                <span className={styles.infoValue}>{patient.edad ? `${patient.edad} años` : 'No registrado'}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Email:</span>
                                <span className={styles.infoValue}>{patient.email || 'No registrado'}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Teléfono:</span>
                                <span className={styles.infoValue}>{patient.phone || 'No registrado'}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Peso:</span>
                                <span className={styles.infoValue}>{patient.peso ? `${patient.peso} kg` : 'No registrado'}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Estatura:</span>
                                <span className={styles.infoValue}>{patient.estatura ? `${patient.estatura} cm` : 'No registrado'}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Fecha registro:</span>
                                <span className={styles.infoValue}>
                                    {new Date(patient.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'citas' && (
                <div className={styles.tabContent}>
                    {appointments.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No hay citas registradas</p>
                            <button onClick={() => navigate(`/appointments?patient=${id}`)}>
                                Crear primera cita
                            </button>
                        </div>
                    ) : (
                        <div className={styles.appointmentsList}>
                            {appointments.map(apt => (
                                <div key={apt.id} className={styles.appointmentCard}>
                                    <div className={styles.appointmentDate}>
                                        {new Date(apt.date).toLocaleDateString()} - {apt.time}
                                    </div>
                                    <div className={styles.appointmentService}>
                                        {apt.service_name}
                                    </div>
                                    <div className={`${styles.appointmentStatus} ${styles[apt.status]}`}>
                                        {apt.status === 'pending' && 'Pendiente'}
                                        {apt.status === 'confirmed' && 'Confirmada'}
                                        {apt.status === 'completed' && 'Completada'}
                                        {apt.status === 'cancelled' && 'Cancelada'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'documentos' && (
                <div className={styles.tabContent}>
                    {documents.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No hay documentos</p>
                            <button onClick={() => navigate(`/documents?patient=${id}`)}>
                                Subir documento
                            </button>
                        </div>
                    ) : (
                        <div className={styles.documentsList}>
                            {documents.map(doc => (
                                <div key={doc.id} className={styles.documentCard}>
                                    <div className={styles.documentIcon}>
                                        {doc.type.includes('pdf') ? '📄' :
                                            doc.type.includes('image') ? '🖼️' : '📎'}
                                    </div>
                                    <div className={styles.documentInfo}>
                                        <div className={styles.documentName}>{doc.name}</div>
                                        <div className={styles.documentMeta}>
                                            {new Date(doc.created_at).toLocaleDateString()} • {doc.category}
                                        </div>
                                    </div>
                                    <div className={styles.documentActions}>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                            👁️
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default PatientDetail