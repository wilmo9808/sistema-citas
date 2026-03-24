import { supabase } from './client'
import { profilesService } from './profiles'

export const authService = {
    async signUp(email: string, password: string, name: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        })

        if (error) throw error
        if (!data.user) throw new Error('Error al crear usuario')

        try {
            await profilesService.create({
                id: data.user.id,
                name,
                email,
                role: 'user',
            })
        } catch (profileError) {
            console.error('Error creando perfil:', profileError)
        }

        return data
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        // La sesión se guarda automáticamente en localStorage por Supabase
        console.log('✅ Login exitoso:', data.session)

        return data
    },

    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        // Limpiar localStorage manualmente
        localStorage.removeItem('supabase.auth.token')
    },

    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    },

    onAuthStateChange(callback: (session: any) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state changed:', _event, session)
            callback(session)
        })
    }
}