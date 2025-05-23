import { createContext } from "react";

export interface UserAuth {
  id: number;
  nombreUsuario: string;
  rol: string;
}

export interface AuthContextType {
  user: UserAuth | null;
  login: (nombreUsuario: string, clave: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOperador: boolean;
  isVisor: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
