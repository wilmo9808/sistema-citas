import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { authService } from '@/services/supabase/auth'

interface PublicRouteProps {
    children: ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const user = await authService.getCurrentUser()
            setIsAuthenticated(!!user)
        } catch (error) {
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-primary)'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid var(--bg-tertiary)',
                    borderTopColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}

export default PublicRoute