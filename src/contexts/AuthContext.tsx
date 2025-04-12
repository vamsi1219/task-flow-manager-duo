
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/services/api";

export type Role = "admin" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  registerEmployee: (name: string, email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setCurrentUser(userData);
        } catch (error) {
          // If token is invalid, clear it
          localStorage.removeItem("authToken");
          console.error("Authentication error:", error);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);
      
      // Save token in localStorage
      localStorage.setItem("authToken", response.token);
      
      // Set current user
      setCurrentUser(response.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      });
      
      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setCurrentUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  const registerEmployee = async (name: string, email: string, password: string) => {
    try {
      await authApi.register(name, email, password, "employee");
      
      toast({
        title: "Registration Successful",
        description: `Employee ${name} has been registered successfully.`,
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register employee",
      });
      
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, registerEmployee, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
