'use client'

import { createContext, useContext, useState } from 'react'


interface AuthContextType {
    user:  string,
    setUser: (user: string | null) => void,
    receiverId: string | null
    setReceiverId: (receiverId: string | null) => void
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<string | null>(null)
    const [receiverId, setReceiverId] = useState<string | null>(null)
    return (
        <AuthContext.Provider value={{ user: user || '', setUser, receiverId, setReceiverId}}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
    const context = useContext(AuthContext)
    return context
}
   

