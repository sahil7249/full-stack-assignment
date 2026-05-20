import { createContext, useEffect, useState, type ReactNode } from "react";
import { type AuthContextType, type User } from "../types/types";
import { api } from "../api/Api";

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderprops = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderprops) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  },[]);

  const login = async (email: string, password: string) => {
    const { token: newToken, user: newUser } = await api.auth.login(
      email,
      password,
    );

    localStorage.setItem('token',newToken)
    localStorage.setItem('user',JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  };

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{user,token,login,logout,isLoading}}>
        {children}
    </AuthContext.Provider>
  )
};
