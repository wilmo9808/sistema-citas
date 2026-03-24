import { supabase } from './client'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export const profilesService = {
    // Obtener perfil por ID
    async getById(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) throw error
        return data as Profile
    },

    // Crear perfil
    async create(profile: Database['public']['Tables']['profiles']['Insert']) {
        const { data, error } = await supabase
            .from('profiles')
            .insert(profile)
            .select()
            .single()

        if (error) throw error
        return data as Profile
    },

    // Obtener perfil del usuario actual
    async getCurrentProfile() {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        if (!user) throw new Error('No hay usuario autenticado')

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) throw error
        return data as Profile
    },

    // Actualizar perfil
    async update(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return data as Profile
    }
}