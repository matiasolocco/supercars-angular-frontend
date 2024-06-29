export interface LoginResponse {
    message: string
    token: string
    role: 'admin' | 'user'
    email: string
    name: string
    id: string
}
