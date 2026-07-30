import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || 'http://localhost:5065'}/api`;

const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor for attaching JWT if needed
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AdminDashboardService = {
    getStats: () => adminApi.get('/AdminDashboard/stats'),
};

export const TeachersService = {
    getAll: () => adminApi.get('/AdminTeachers'),
    create: (data: any) => adminApi.post('/AdminTeachers', data),
    update: (id: number, data: any) => adminApi.put(`/AdminTeachers/${id}`, data),
    delete: (id: number) => adminApi.delete(`/AdminTeachers/${id}`),
    activate: (id: number) => adminApi.post(`/AdminTeachers/${id}/activate`),
    deactivate: (id: number) => adminApi.post(`/AdminTeachers/${id}/deactivate`),
};

export const StudentsService = {
    getAll: () => adminApi.get('/AdminStudents'),
    create: (data: any) => adminApi.post('/AdminStudents', data),
    update: (id: number, data: any) => adminApi.put(`/AdminStudents/${id}`, data),
    delete: (id: number) => adminApi.delete(`/AdminStudents/${id}`),
    activate: (id: number) => adminApi.post(`/AdminStudents/${id}/activate`),
    deactivate: (id: number) => adminApi.post(`/AdminStudents/${id}/deactivate`),
};

export const ClassesService = {
    getAll: () => adminApi.get('/AdminClasses'),
    create: (data: any) => adminApi.post('/AdminClasses', data),
    update: (id: number, data: any) => adminApi.put(`/AdminClasses/${id}`, data),
    delete: (id: number) => adminApi.delete(`/AdminClasses/${id}`),
    assignTeacher: (classId: number, teacherId: number) => adminApi.post(`/AdminClasses/${classId}/assign-teacher/${teacherId}`),
    removeTeacher: (classId: number, teacherId: number) => adminApi.delete(`/AdminClasses/${classId}/remove-teacher/${teacherId}`),
    enrollStudent: (classId: number, studentId: number) => adminApi.post(`/AdminClasses/${classId}/enroll-student/${studentId}`),
    unenrollStudent: (studentId: number) => adminApi.post(`/AdminClasses/unenroll-student/${studentId}`),
};

export const AuthorizedUsersService = {
    getAll: () => adminApi.get('/AuthorizedUsers'),
    create: (data: any) => adminApi.post('/AuthorizedUsers', data),
    update: (id: number, data: any) => adminApi.put(`/AuthorizedUsers/${id}`, data),
    delete: (id: number) => adminApi.delete(`/AuthorizedUsers/${id}`),
};


export const RegistrationsService = {
    getRequests: () => adminApi.get('/Registration/requests'),
    approve: (id: number) => adminApi.post(`/Registration/approve/${id}`),
    reject: (id: number) => adminApi.post(`/Registration/reject/${id}`),
};

export default adminApi;
