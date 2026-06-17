import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; 
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token1, setToken] = useState(localStorage.getItem('token'));
    const initApp = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get(`${apiBaseUrl}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(res.data)
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setUser(null)
            }
            console.log(error.message)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        initApp(); // run immediately on mount
        const intervalId = setInterval(() => initApp(), 4000);
        return () => clearInterval(intervalId);
    }, [token1])
    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }
    return (
        <AuthContext.Provider value={{ user, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
