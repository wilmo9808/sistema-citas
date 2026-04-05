import React from 'react'
import { FileText, Image, FileEdit, Paperclip, Eye, Trash2 } from 'lucide-react'
import { Document } from '@/types/documents'
import styles from './DocumentCard.module.css'

interface Props {
    document: Document
    onPreview: () => void
    onDelete: () => void
}

const getIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText size={24} />
    if (type.includes('image')) return <Image size={24} />
    if (type.includes('word')) return <FileEdit size={24} />
    return <Paperclip size={24} />
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
                    <Eye size={18} />
                </button>
                <button className={styles.deleteBtn} onClick={onDelete}>
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    )
}

export default DocumentCard