"use client"

import React, { createContext, useContext } from "react"
import { useState, useEffect } from "react"
import Cookies from 'js-cookie';

type User = {
     id: string
     email: string,
     role: string,
     status: string,
     name: string
}

type AuthContextType = {
     user: User | null
     loading: boolean
     refreshUser: () => Promise<void>,
     setCookie: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null)
     const [loading, setLoading] = useState(true)

     const loadUser = async () => {
          setLoading(true)
          try {
               const res = await fetch("/api/me", {
                    method: "GET",
                    credentials: "include", // send HTTP-only cookie
               })
               const data = await res.json()
               setUser(data)
          } catch (err) {
               console.error("Failed to load user:", err)
               setUser(null)
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          loadUser()
     }, [])


     const setCookie = (token: string) => {
          Cookies.set("token", token, { expires: 7 });
     };

     return (
          <AuthContext.Provider value={{ user, loading, refreshUser: loadUser, setCookie }}>
               {children}
          </AuthContext.Provider>
     )
}

export const useAuth = () => {
     const ctx = useContext(AuthContext)
     if (!ctx) {
          throw new Error("useAuth must be used inside AuthProvider")
     }
     return ctx
}
