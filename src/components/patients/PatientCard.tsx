import React from 'react'
import { Patient } from '@/types/patients'
import styles from './PatientCard.module.css'

interface PatientCardProps {
    patient: Patient
    onClick?: () => void
    onDelete?: () => void
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick, onDelete }) => {
    const initials = patient.name
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    const getSexoIcon = (sexo: string | null) => {
        if (sexo === 'M') return '👨'
        if (sexo === 'F') return '👩'
        return '👤'
    }

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.avatar}>
                {initials}
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{patient.name}</h3>
                <div className={styles.details}>
                    {patient.sexo && (
                        <span className={styles.badge}>
                            {getSexoIcon(patient.sexo)} {patient.sexo === 'M' ? 'Masculino' : patient.sexo === 'F' ? 'Femenino' : 'Otro'}
                        </span>
                    )}
                    {patient.edad && (
                        <span className={styles.badge}> {patient.edad} años</span>
                    )}
                    {patient.documento && (
                        <span className={styles.badge}> {patient.documento}</span>
                    )}
                </div>
                {patient.email && (
                    <p className={styles.email}> {patient.email}</p>
                )}
                {patient.phone && (
                    <p className={styles.phone}> {patient.phone}</p>
                )}
                {patient.peso && patient.estatura && (
                    <p className={styles.healthData}>
                        {patient.peso} kg |  {patient.estatura} cm
                    </p>
                )}
            </div>
            {onDelete && (
                <button
                    className={styles.deleteBtn}
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                >
                    🗑️
                </button>
            )}
        </div>
    )
}

export default PatientCard