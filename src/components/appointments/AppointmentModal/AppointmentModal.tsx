import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './AppointmentModal.module.css'

interface AppointmentModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
    isOpen,
    onClose,
    children
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={20} />
                </button>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AppointmentModal