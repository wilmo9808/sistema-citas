import React, { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { storageService } from '@/services/supabase/storage'
import styles from './DocumentUpload.module.css'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    patientId: string  // 👈 NUEVO - Recibir patientId desde el padre
}

const DocumentUpload: React.FC<Props> = ({ isOpen, onClose, onSuccess, patientId }) => {
    const { user } = useAuth()
    const [file, setFile] = useState<File | null>(null)
    const [category, setCategory] = useState('receta')
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !user || !patientId) {
            console.log('❌ Falta archivo, usuario o patientId')
            return
        }

        setUploading(true)
        try {
            // 👈 USAR patientId en lugar de user.id
            await storageService.uploadFile(file, patientId, user.id, category)
            onSuccess()
            onClose()
            setFile(null)
        } catch (error) {
            console.error('Error subiendo archivo:', error)
            alert('Error al subir el archivo')
        } finally {
            setUploading(false)
        }
    }

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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>📤 Subir Documento</h2>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Categoría</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.select}
                        >
                            <option value="receta">Formulas</option>
                            <option value="radiografia">Examenes</option>
                            <option value="informe">Historia</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Archivo</label>
                        {!file ? (
                            <div
                                className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className={styles.dropzoneContent}>
                                    <span className={styles.uploadIcon}>📁</span>
                                    <p>Arrastra un archivo aquí o haz clic para seleccionar</p>
                                    <span className={styles.allowedFormats}>
                                        PDF, JPG, PNG, DOC, DOCX
                                    </span>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    className={styles.fileInput}
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                />
                            </div>
                        ) : (
                            <div className={styles.fileInfo}>
                                <span className={styles.fileIcon}>📄</span>
                                <div className={styles.fileDetails}>
                                    <p className={styles.fileName}>{file.name}</p>
                                    <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
                                </div>
                                <button
                                    type="button"
                                    className={styles.removeFile}
                                    onClick={() => setFile(null)}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
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
                    <p>Formatos: PDF, JPG, PNG, DOC, DOCX</p>
                    <p>Tamaño máximo: 10 MB</p>
                </div>
            </div>
        </div>
    )
}

export default DocumentUpload