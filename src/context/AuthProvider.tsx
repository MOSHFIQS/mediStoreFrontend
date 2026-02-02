"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { User } from '@/types/user.types';

type AuthContextType = {
     user: User | null;
     token: string | null;
     loading: boolean;
     setCookie: (userData: User, token: string) => void;
     setUser: (user: User | null) => void;
     logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
     children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
     const [user, setUser] = useState<User | null>(null);
     const [token, setToken] = useState<string | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const cookieToken = Cookies.get("token");
          const cookieUser = Cookies.get("user");
          if (cookieToken) setToken(cookieToken);
          if (cookieUser) setUser(JSON.parse(cookieUser));
          setLoading(false);
     }, []);

     const setCookie = (userData: User, token: string) => {
          setUser(userData);
          setToken(token);
          Cookies.set("token", token, { expires: 7 });
          Cookies.set("user", JSON.stringify(userData), { expires: 7 });
     };

     const logout = () => {
          setUser(null);
          setToken(null);
          Cookies.remove("token");
          Cookies.remove("user");
     };

     return (
          <AuthContext.Provider value={{ user, token, loading, setUser, logout, setCookie }}>
               {children}
          </AuthContext.Provider>
     );
};

export const useAuth = (): AuthContextType => {
     const context = useContext(AuthContext);
     if (!context) throw new Error("useAuth must be used within AuthProvider");
     return context;
};
