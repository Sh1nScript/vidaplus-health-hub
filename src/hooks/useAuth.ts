import { useState, useEffect } from "react";

/**
 * Representa o usuário autenticado carregado do armazenamento local.
 * Em produção, substituir por payload vindo do backend / token JWT decodificado.
 */

export interface User {
  username: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
}

/**
 * Hook de autenticação simplificado.
 * Responsável por:
 *  - Ler o usuário persistido no localStorage (chave `vidaplus_user`).
 *  - Expor estado de carregamento inicial (hydration) e flag de autenticado.
 *  - Persistir alterações de usuário via `updateUser`.
 *  - Limpar sessão via `logout`.
 * NOTA: Este hook não valida expiração nem integra com servidor.
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bootstrap inicial: tenta ler o usuário do localStorage
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

  /** Remove o usuário atual e limpa persistência. */
  const logout = () => {
    localStorage.removeItem("vidaplus_user");
    setUser(null);
  };

  /** Atualiza o usuário em memória e persiste no localStorage. */
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