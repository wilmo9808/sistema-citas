import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { authService } from '@/services/supabase/auth'
import { profilesService } from '@/services/supabase/profiles'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
    user: User | null
    profile: Profile | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, name: string) => Promise<void>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Cargar usuario inicial
        loadUser()

        // Suscribirse a cambios de autenticación
        const { data: { subscription } } = authService.onAuthStateChange((session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                loadProfile(session.user.id)
            } else {
                setProfile(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const loadUser = async () => {
        try {
            const user = await authService.getCurrentUser()
            setUser(user)
            if (user) {
                await loadProfile(user.id)
            }
        } catch (error) {
            console.error('Error loading user:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadProfile = async (userId: string) => {
        try {
            const profile = await profilesService.getById(userId)
            setProfile(profile)
        } catch (error) {
            console.error('Error loading profile:', error)
        }
    }

    const signIn = async (email: string, password: string) => {
        await authService.signIn(email, password)
    }

    const signUp = async (email: string, password: string, name: string) => {
        await authService.signUp(email, password, name)
    }

    const signOut = async () => {
        await authService.signOut()
        setUser(null)
        setProfile(null)
    }

    const refreshProfile = async () => {
        if (user) {
            await loadProfile(user.id)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            signIn,
            signUp,
            signOut,
            refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de AuthProvider')
    }
    return context
}