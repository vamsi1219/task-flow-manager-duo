
import React, { createContext, useState, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export type Role = "admin" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as Role,
  },
  {
    id: "2",
    name: "Employee 1",
    email: "employee1@example.com",
    password: "employee1",
    role: "employee" as Role,
  },
  {
    id: "3",
    name: "Employee 2",
    email: "employee2@example.com",
    password: "employee2",
    role: "employee" as Role,
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = (email: string, password: string) => {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      
      if (userWithoutPassword.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password.",
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate("/");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin }}>
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
