import { useState, useEffect } from "react";

export interface User {
  username: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem("vidaplus_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao parsear usuário:", error);
        localStorage.removeItem("vidaplus_user");
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("vidaplus_user");
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("vidaplus_user", JSON.stringify(userData));
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    updateUser
  };
};