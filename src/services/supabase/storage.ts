import { supabase } from './client'
import { Document } from '@/types/documents'

const BUCKET_NAME = 'documents'

// Función para sanitizar nombres de archivo
const sanitizeFileName = (fileName: string): string => {
    // Eliminar espacios y caracteres especiales
    return fileName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
        .replace(/[^a-zA-Z0-9.-]/g, '_') // Reemplazar caracteres no válidos por _
        .replace(/_+/g, '_') // Reemplazar múltiples _ por uno solo
        .replace(/^_+|_+$/g, '') // Eliminar _ al inicio y final
}

export const storageService = {

    // Subir archivo - ASOCIADO A PACIENTE
    async uploadFile(file: File, patientId: string, userId: string, category: string): Promise<Document> {
        // Sanitizar nombre del archivo
        const safeFileName = sanitizeFileName(file.name)
        const fileName = `${patientId}/${Date.now()}_${safeFileName}`

        console.log('📁 Subiendo archivo:', fileName)

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('❌ Error en upload:', uploadError)
            throw uploadError
        }

        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName)

        // Guardar metadata en la tabla documents
        const { data: docData, error: docError } = await supabase
            .from('documents')
            .insert({
                name: file.name,
                type: file.type,
                size: file.size,
                url: fileName,
                category,
                patient_id: patientId,
                user_id: userId,
                appointment_id: null
            })
            .select()
            .single()

        if (docError) {
            console.error('❌ Error en insert:', docError)
            throw docError
        }

        console.log('✅ Archivo subido exitosamente:', fileName)

        return {
            ...docData,
            url: urlData.publicUrl
        } as Document
    },

    // Obtener documentos de un paciente específico
    async getPatientDocuments(patientId: string): Promise<Document[]> {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return data.map(doc => ({
            ...doc,
            url: this.getPublicUrl(doc.url)
        }))
    },

    // Obtener documentos de una cita específica
    async getAppointmentDocuments(appointmentId: string): Promise<Document[]> {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('appointment_id', appointmentId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return data.map(doc => ({
            ...doc,
            url: this.getPublicUrl(doc.url)
        }))
    },

    // Obtener todos los documentos del usuario (profesional) - LEGADO
    async getUserDocuments(userId: string): Promise<Document[]> {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return data.map(doc => ({
            ...doc,
            url: this.getPublicUrl(doc.url)
        }))
    },

    // Obtener URL pública
    getPublicUrl(path: string): string {
        const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(path)

        return data.publicUrl
    },

    // Eliminar documento
    async deleteDocument(documentId: string, path: string) {
        const { error: storageError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([path])

        if (storageError) throw storageError

        const { error: dbError } = await supabase
            .from('documents')
            .delete()
            .eq('id', documentId)

        if (dbError) throw dbError

        return true
    }
}