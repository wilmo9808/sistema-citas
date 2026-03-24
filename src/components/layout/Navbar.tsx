import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import styles from './Navbar.module.css'

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, profile, signOut } = useAuth()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLinkClick = () => {
        setIsOpen(false)
    }

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
        handleLinkClick()
    }

    // Items de navegación
    const getNavItems = () => {
        // Items públicos (sin autenticación)
        const publicItems = !user ? [
            { path: '/login', label: 'Iniciar Sesión', public: true },
            { path: '/register', label: 'Registrarse', public: true },
        ] : []

        // Items privados (solo si está autenticado)
        const privateItems = user ? [
            { path: '/dashboard', label: 'Dashboard', public: false },
            { path: '/appointments', label: 'Citas', public: false },
            { path: '/documents', label: 'Documentos', public: false },
            { path: '/patients', label: 'Pacientes', public: false },
        ] : []

        return [...publicItems, ...privateItems]
    }

    const navItems = getNavItems()

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className="container">
                <div className={styles.navContainer}>
                    {/* Logo */}
                    <div className={styles.logoContainer}>
                        <Link to={user ? '/dashboard' : '/login'} className={styles.logo} onClick={handleLinkClick}>
                            Sistema de Citas
                        </Link>
                    </div>

                    {/* Menú de navegación - ESCRITORIO */}
                    <ul className={styles.desktopNavLinks}>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                                    onClick={handleLinkClick}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Sección derecha */}
                    <div className={styles.rightSection}>
                        {user && (
                            <div className={styles.userMenu}>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>
                                        {profile?.name || user.email?.split('@')[0]}
                                    </span>
                                    <span className={styles.userRole}>
                                        {profile?.role === 'admin' ? 'Admin' : 'Usuario'}
                                    </span>
                                </div>
                                <button
                                    className={styles.logoutButton}
                                    onClick={handleLogout}
                                    aria-label="Cerrar sesión"
                                >
                                    <span className={styles.logoutIcon}></span>
                                    <span className={styles.logoutText}>Salir</span>
                                </button>
                            </div>
                        )}

                        {/* Hamburger menu */}
                        <button
                            className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Menú"
                            aria-expanded={isOpen}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>

                    {/* Menú móvil */}
                    <ul className={`${styles.mobileNavLinks} ${isOpen ? styles.open : ''}`}>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                                    onClick={handleLinkClick}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar