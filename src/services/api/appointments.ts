import api from './config'
import { Appointment, AppointmentFormData } from '../../types'

export const appointmentsApi = {
    getAll: () => api.get<Appointment[]>('/appointments'),

    getById: (id: string) => api.get<Appointment>(`/appointments/${id}`),

    create: (data: AppointmentFormData) => api.post<Appointment>('/appointments', {
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
    }),

    update: (id: string, data: Partial<Appointment>) =>
        api.put<Appointment>(`/appointments/${id}`, data),

    delete: (id: string) => api.delete(`/appointments/${id}`),

    getByStatus: (status: string) =>
        api.get<Appointment[]>(`/appointments?status=${status}`),

    getByDate: (date: string) =>
        api.get<Appointment[]>(`/appointments?date=${date}`),
}