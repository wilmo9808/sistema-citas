import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { patientsService } from '@/services/supabase/patients'
import { Patient } from '@/types/patients'
import PatientCard from '@/components/patients/PatientCard'
import PatientForm from '@/components/patients/PatientForm'
import styles from './Patients.module.css'

const Patients: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [patients, setPatients] = useState<Patient[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

    useEffect(() => {
        if (user) {
            loadPatients()
        }
    }, [user])

    const loadPatients = async () => {
        try {
            setLoading(true)
            const data = await patientsService.getAll()
            setPatients(data)
        } catch (error) {
            console.error('Error cargando pacientes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (data: any) => {
        await patientsService.create(data)
        setShowForm(false)
        await loadPatients()
    }

    const handleUpdate = async (data: any) => {
        if (editingPatient) {
            await patientsService.update(editingPatient.id, data)
            setEditingPatient(null)
            await loadPatients()
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar este paciente? Se eliminarán también sus citas y documentos.')) {
            try {
                await patientsService.delete(id)
                await loadPatients()
            } catch (error) {
                console.error('Error eliminando:', error)
                alert('Error al eliminar el paciente')
            }
        }
    }


    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Cargando pacientes...</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Pacientes</h1>
                <button
                    className={styles.addButton}
                    onClick={() => {
                        setEditingPatient(null)
                        setShowForm(true)
                    }}
                >
                    + Nuevo Paciente
                </button>
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <PatientForm
                        title={editingPatient ? 'Editar Paciente' : 'Crear Nuevo Paciente'}
                        initialData={editingPatient || undefined}
                        onSubmit={editingPatient ? handleUpdate : handleCreate}
                        onCancel={() => {
                            setShowForm(false)
                            setEditingPatient(null)
                        }}
                    />
                </div>
            )}

            {patients.length === 0 ? (
                <div className={styles.empty}>
                    <p><Inbox size={20} style={{ marginRight: 6, verticalAlign: 'middle' }} /> No tienes pacientes registrados</p>
                    <button onClick={() => {
                        setEditingPatient(null)
                        setShowForm(true)
                    }}>
                        Crear mi primer paciente
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {patients.map(patient => (
                        <PatientCard
                            key={patient.id}
                            patient={patient}
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            onDelete={() => handleDelete(patient.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Patients