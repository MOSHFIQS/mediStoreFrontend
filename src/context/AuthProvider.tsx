"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { User } from '@/types/user.types';



//  Context type
type AuthContextType = {
     user: User | null;
     setCookie: (userData: User, token: string) => void;
     setUser: (user: User | null) => void;
     logout: () => void;
     token: string | null;
};

//  Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//  Provider props type
type AuthProviderProps = {
     children: ReactNode;
};

//  Provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
     const [user, setUser] = useState<User | null>(null);
     const [token, setToken] = useState<string | null>(null);

     // Load user and token from cookies
     useEffect(() => {
          const cookieToken = Cookies.get("token");
          const cookieUser = Cookies.get("user");
          if (cookieToken) setToken(cookieToken);
          if (cookieUser) setUser(JSON.parse(cookieUser));
     }, []);

     const setCookie = (userData: User, token: string) => {
          setUser(userData);
          setToken(token);

          // Save in cookies
          Cookies.set("token", token, { expires: 7 });
          localStorage.setItem('token', token);
          Cookies.set("user", JSON.stringify(userData), { expires: 7 });
     };

     const logout = () => {
          setUser(null);
          setToken(null);
          Cookies.remove("token");
          Cookies.remove("user");
     };

     return (
          <AuthContext.Provider value={{ user, setUser, logout, setCookie, token }}>
               {children}
          </AuthContext.Provider>
     );
};


export const useAuth = (): AuthContextType => {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error("useAuth must be used within AuthProvider");
     }
     return context;
};