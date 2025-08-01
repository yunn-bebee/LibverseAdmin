/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { postData } from '../app/api';

// Define the structure of the login response
interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Update AuthContextType to use specific types instead of any
interface AuthContextType {
  user: LoginResponse['user'] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);

  const login = async (email: string, password: string) => {
    // Specify the type parameter for postData
    const response = await postData<LoginResponse>('/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}