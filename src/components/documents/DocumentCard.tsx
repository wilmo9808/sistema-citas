import React from 'react'
import { Document } from '@/types/documents'
import styles from './DocumentCard.module.css'

interface Props {
    document: Document
    onPreview: () => void
    onDelete: () => void
}

const getIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    if (type.includes('word')) return '📝'
    return '📎'
}

const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

const DocumentCard: React.FC<Props> = ({ document, onPreview, onDelete }) => {
    const date = new Date(document.created_at).toLocaleDateString('es-ES')

    return (
        <div className={styles.card}>
            <div className={styles.icon}>{getIcon(document.type)}</div>
            <div className={styles.info}>
                <h3 className={styles.name}>{document.name}</h3>
                <p className={styles.meta}>
                    {formatSize(document.size)} • {date}
                </p>
            </div>
            <div className={styles.actions}>
                <button className={styles.previewBtn} onClick={onPreview}>
                    👁️
                </button>
                <button className={styles.deleteBtn} onClick={onDelete}>
                    🗑️
                </button>
            </div>
        </div>
    )
}

export default DocumentCard