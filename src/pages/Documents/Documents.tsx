import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { storageService } from '@/services/supabase/storage'
import { patientsService } from '@/services/supabase/patients'
import { Patient } from '@/types/patients'
import { Document } from '@/types/documents'
import DocumentCard from '@/components/documents/DocumentCard'
import DocumentUpload from '@/components/documents/DocumentUpload'
import DocumentPreview from '@/components/documents/DocumentPreview'
import PatientSelector from '@/components/patients/PatientSelector'
import styles from './Documents.module.css'

const Documents: React.FC = () => {
    const { user } = useAuth()
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
    const [showUpload, setShowUpload] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [patients, setPatients] = useState<Patient[]>([])

    // Cargar pacientes del usuario
    useEffect(() => {
        if (user) {
            loadPatients()
        }
    }, [user])

    // Cargar documentos cuando cambia el paciente seleccionado
    useEffect(() => {
        if (selectedPatient) {
            loadDocuments()
        } else {
            setDocuments([])
        }
    }, [selectedPatient])

    const loadPatients = async () => {
        if (!user) return
        try {
            const data = await patientsService.getAll()
            setPatients(data)
            // Si hay pacientes, seleccionar el primero por defecto
            if (data.length > 0) {
                setSelectedPatient(data[0])
            }
        } catch (error) {
            console.error('Error cargando pacientes:', error)
        }
    }

    const loadDocuments = async () => {
        if (!selectedPatient) return
        try {
            setLoading(true)
            const docs = await storageService.getPatientDocuments(selectedPatient.id)
            setDocuments(docs)
        } catch (error) {
            console.error('Error cargando documentos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (doc: Document) => {
        if (confirm('¿Eliminar este documento?')) {
            try {
                await storageService.deleteDocument(doc.id, doc.url)
                await loadDocuments()
            } catch (error) {
                console.error('Error eliminando:', error)
            }
        }
    }

    const handleUploadSuccess = () => {
        setShowUpload(false)
        loadDocuments()
    }

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient)
    }

    const categories = [
        { label: 'Todas', value: 'all', count: documents.length },
        { label: 'Formulas', value: 'receta', count: documents.filter(d => d.category === 'receta').length },
        { label: 'Examenes', value: 'radiografia', count: documents.filter(d => d.category === 'radiografia').length },
        { label: 'Historia', value: 'informe', count: documents.filter(d => d.category === 'informe').length },
        { label: 'Otros', value: 'otros', count: documents.filter(d => d.category === 'otros').length },
    ]

    if (!selectedPatient && patients.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>
                    <p>📭 No tienes pacientes registrados</p>
                    <button onClick={() => window.location.href = '/appointments'}>
                        Crear primera cita
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>📎 Documentos</h1>
                <button
                    className={styles.uploadButton}
                    onClick={() => setShowUpload(true)}
                    disabled={!selectedPatient}
                >
                    + Subir Documento
                </button>
            </div>

            {/* Selector de pacientes */}
            <PatientSelector
                patients={patients}
                selectedPatient={selectedPatient}
                onSelect={handlePatientSelect}
                onPatientCreated={loadPatients}
            />

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{documents.length}</span>
                    <span className={styles.statLabel}>Documentos</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {(documents.reduce((acc, d) => acc + (d.size || 0), 0) / 1024 / 1024).toFixed(1)}
                    </span>
                    <span className={styles.statLabel}>MB Totales</span>
                </div>
            </div>

            <div className={styles.categories}>
                {categories.map(cat => (
                    <button key={cat.value} className={styles.categoryButton}>
                        {cat.label}
                        <span className={styles.categoryCount}>{cat.count}</span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Cargando documentos...</p>
                </div>
            ) : documents.length === 0 ? (
                <div className={styles.empty}>
                    <p>No hay documentos para este paciente</p>
                    <button onClick={() => setShowUpload(true)}>
                        Subir primer documento
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {documents.map(doc => (
                        <DocumentCard
                            key={doc.id}
                            document={doc}
                            onPreview={() => setSelectedDoc(doc)}
                            onDelete={() => handleDelete(doc)}
                        />
                    ))}
                </div>
            )}

            {selectedPatient && (
                <DocumentUpload
                    isOpen={showUpload}
                    onClose={() => setShowUpload(false)}
                    onSuccess={handleUploadSuccess}
                    patientId={selectedPatient.id}
                />
            )}

            <DocumentPreview
                document={selectedDoc}
                onClose={() => setSelectedDoc(null)}
            />
        </div>
    )
}

export default Documents