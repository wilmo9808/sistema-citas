import React from 'react'
import { X, FileText } from 'lucide-react'
import { Document } from '@/types/documents'
import styles from './DocumentPreview.module.css'

interface Props {
    document: Document | null
    onClose: () => void
}

const DocumentPreview: React.FC<Props> = ({ document, onClose }) => {
    if (!document) return null

    const isImage = document.type.includes('image')
    const isPDF = document.type.includes('pdf')

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>{document.name}</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <div className={styles.preview}>
                    {isImage && (
                        <img src={document.url} alt={document.name} />
                    )}
                    {isPDF && (
                        <iframe src={document.url} title={document.name} />
                    )}
                    {!isImage && !isPDF && (
                        <div className={styles.fallback}>
                            <p><FileText size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} /> {document.name}</p>
                            <a href={document.url} download>Descargar archivo</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DocumentPreview