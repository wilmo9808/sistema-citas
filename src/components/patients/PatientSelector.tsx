import React, { useState } from 'react'
import { Patient } from '@/types/patients'
import { patientsService } from '@/services/supabase/patients'
import styles from './PatientSelector.module.css'

interface PatientSelectorProps {
    patients: Patient[]
    selectedPatient: Patient | null
    onSelect: (patient: Patient) => void
    onPatientCreated?: () => void
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
    patients,
    selectedPatient,
    onSelect,
    onPatientCreated
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showNewPatientForm, setShowNewPatientForm] = useState(false)
    const [newPatient, setNewPatient] = useState({
        name: '',
        email: '',
        phone: '',
        sexo: '',
        edad: '',
        documento: '',
        peso: '',
        estatura: ''
    })
    const [creating, setCreating] = useState(false)

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.documento?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewPatient(prev => ({ ...prev, [name]: value }))
    }

    const handleCreatePatient = async () => {
        if (!newPatient.name.trim()) return

        setCreating(true)
        try {
            const createdPatient = await patientsService.create({
                name: newPatient.name.trim(),
                email: newPatient.email.trim() || null,
                phone: newPatient.phone.trim() || null,
                sexo: newPatient.sexo as 'M' | 'F' | 'Otro' | null,
                edad: newPatient.edad ? parseInt(newPatient.edad) : null,
                documento: newPatient.documento.trim() || null,
                peso: newPatient.peso ? parseFloat(newPatient.peso) : null,
                estatura: newPatient.estatura ? parseFloat(newPatient.estatura) : null
            })
            onSelect(createdPatient)
            setShowNewPatientForm(false)
            setNewPatient({
                name: '', email: '', phone: '', sexo: '', edad: '', documento: '', peso: '', estatura: ''
            })
            onPatientCreated?.()
        } catch (error) {
            console.error('Error creando paciente:', error)
            alert('Error al crear paciente')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>Paciente</label>

            {!showNewPatientForm ? (
                <>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Buscar por nombre, email o documento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            type="button"
                            className={styles.newButton}
                            onClick={() => setShowNewPatientForm(true)}
                        >
                            + Nuevo
                        </button>
                    </div>

                    <div className={styles.patientsList}>
                        {filteredPatients.length === 0 ? (
                            <div className={styles.noResults}>
                                No se encontraron pacientes
                            </div>
                        ) : (
                            filteredPatients.map(patient => (
                                <div
                                    key={patient.id}
                                    className={`${styles.patientItem} ${selectedPatient?.id === patient.id ? styles.selected : ''
                                        }`}
                                    onClick={() => onSelect(patient)}
                                >
                                    <div className={styles.patientName}>{patient.name}</div>
                                    <div className={styles.patientInfo}>
                                        {patient.documento && <span>🪪 {patient.documento}</span>}
                                        {patient.edad && <span>🎂 {patient.edad} años</span>}
                                        {patient.sexo && <span>{patient.sexo === 'M' ? '👨' : '👩'}</span>}
                                    </div>
                                    <div className={styles.patientEmail}>
                                        {patient.email || 'Sin email'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div className={styles.newPatientForm}>
                    <input
                        type="text"
                        name="name"
                        className={styles.input}
                        placeholder="Nombre completo *"
                        value={newPatient.name}
                        onChange={handleChange}
                    />
                    <div className={styles.row}>
                        <input
                            type="text"
                            name="documento"
                            className={styles.input}
                            placeholder="Documento (CC, TI)"
                            value={newPatient.documento}
                            onChange={handleChange}
                        />
                        <select
                            name="sexo"
                            className={styles.select}
                            value={newPatient.sexo}
                            onChange={handleChange}
                        >
                            <option value="">Sexo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <input
                            type="number"
                            name="edad"
                            className={styles.input}
                            placeholder="Edad"
                            value={newPatient.edad}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="email"
                            name="email"
                            className={styles.input}
                            placeholder="Email"
                            value={newPatient.email}
                            onChange={handleChange}
                        />
                        <input
                            type="tel"
                            name="phone"
                            className={styles.input}
                            placeholder="Teléfono"
                            value={newPatient.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="number"
                            name="peso"
                            className={styles.input}
                            placeholder="Peso (kg)"
                            step="0.1"
                            value={newPatient.peso}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="estatura"
                            className={styles.input}
                            placeholder="Estatura (cm)"
                            step="0.1"
                            value={newPatient.estatura}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formButtons}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setShowNewPatientForm(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className={styles.createButton}
                            onClick={handleCreatePatient}
                            disabled={!newPatient.name.trim() || creating}
                        >
                            {creating ? 'Creando...' : 'Crear Paciente'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PatientSelector