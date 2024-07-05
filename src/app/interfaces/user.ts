export interface User {
    name?: string
    email?: string
    token: string
    role: 'admin' | 'user'
    _id: string
} 
