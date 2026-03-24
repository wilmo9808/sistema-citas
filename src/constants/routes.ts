export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    PROJECTS: '/projects',
    CONTACT: '/contact',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    APPOINTMENTS: '/appointments',
} as const

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.ABOUT,
    ROUTES.PROJECTS,
    ROUTES.CONTACT,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
]

export const PRIVATE_ROUTES = [
    ROUTES.DASHBOARD,
    ROUTES.APPOINTMENTS,
]

export const SOCIAL_LINKS = {
    GITHUB: 'https://github.com/wilmo9808',
    LINKEDIN: 'https://www.linkedin.com/in/wilson-molina-lozano-12508811b/',
    EMAIL: 'molina9808@gmail.com',
} as const