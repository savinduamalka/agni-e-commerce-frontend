import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log("Decoded token on page load:", decodedToken);
        const name = decodedToken.name || `${decodedToken.firstName} ${decodedToken.lastName}`;
        const userData = {
          email: decodedToken.email,
          name: name,
          avatarUrl: decodedToken.avatar || decodedToken.picture,
          role: decodedToken.role,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log("Decoded token on login:", decodedToken);
      const name = decodedToken.name || `${decodedToken.firstName} ${decodedToken.lastName}`;
      const userData = {
        email: decodedToken.email,
        name: name,
        avatarUrl: decodedToken.avatar || decodedToken.picture,
        role: decodedToken.role,
      };
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
