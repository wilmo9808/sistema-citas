import React, { useState } from 'react'
import { Paperclip, X, FileText, FolderUp, Lightbulb, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { storageService } from '@/services/supabase/storage'
import styles from './DocumentModal.module.css'

interface DocumentModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    patientId: string
}

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, onSuccess, patientId }) => {
    const { user } = useAuth()
    const [file, setFile] = useState<File | null>(null)
    const [category, setCategory] = useState('receta')
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile && isValidFile(droppedFile)) {
            setFile(droppedFile)
        } else {
            alert('Formato no válido. Usa PDF, JPG, PNG, DOC o DOCX')
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && isValidFile(selectedFile)) {
            setFile(selectedFile)
        } else {
            alert('Formato no válido. Usa PDF, JPG, PNG, DOC o DOCX')
        }
    }

    const isValidFile = (file: File) => {
        const validTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        return validTypes.includes(file.type)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / 1024 / 1024).toFixed(1) + ' MB'
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !user) return

        setUploading(true)
        try {
            await storageService.uploadFile(file, patientId, user.id, category)
            onSuccess()
            onClose()
            setFile(null)
            setCategory('receta')
        } catch (error) {
            console.error('Error subiendo archivo:', error)
            alert('Error al subir el archivo')
        } finally {
            setUploading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}><Paperclip size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Subir Documento</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Categoría</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.select}
                        >
                            <option value="receta">Receta</option>
                            <option value="radiografia">Radiografía</option>
                            <option value="informe">Informe</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Archivo</label>
                        <div
                            className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            <input
                                type="file"
                                id="fileInput"
                                onChange={handleFileSelect}
                                className={styles.fileInput}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                            {file ? (
                                <div className={styles.fileInfo}>
                                    <span className={styles.fileIcon}><FileText size={24} /></span>
                                    <div className={styles.fileDetails}>
                                        <p className={styles.fileName}>{file.name}</p>
                                        <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.removeFile}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setFile(null)
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.dropzoneContent}>
                                    <span className={styles.uploadIcon}><FolderUp size={40} /></span>
                                    <p>Arrastra tu archivo aquí o haz clic para seleccionar</p>
                                    <small className={styles.allowedFormats}>
                                        Formatos permitidos: PDF, JPG, PNG, DOC, DOCX
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={uploading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={!file || uploading}
                        >
                            {uploading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Subiendo...
                                </>
                            ) : (
                                'Subir Documento'
                            )}
                        </button>
                    </div>
                </form>

                <div className={styles.info}>
                    <p><Lightbulb size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Los documentos se guardan de forma segura y solo son visibles para ti.</p>
                    <p><Mail size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Puedes adjuntar estos documentos a tus citas para referencia.</p>
                </div>
            </div>
        </div>
    )
}

export default DocumentModal