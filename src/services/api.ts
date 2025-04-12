
// API Client Service
// This file provides a structured way to interact with your backend API

import { User, Role } from "@/contexts/AuthContext";
import { Task } from "@/contexts/TaskContext";
import { toast } from "@/components/ui/use-toast";

// Base URL for API requests - update this when you set up your backend
const API_BASE_URL = "http://localhost:5000/api";

// Helper function for making API requests
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  // Include auth token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    toast({
      variant: "destructive",
      title: "Request Failed",
      description: error instanceof Error ? error.message : "API request failed",
    });
    throw error;
  }
};

// Authentication APIs
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (name: string, email: string, password: string, role: Role) => {
    return fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  },
  
  getCurrentUser: async () => {
    return fetchApi("/auth/me");
  },
  
  logout: async () => {
    // Clean up local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    return { success: true };
  }
};

// Tasks APIs
export const taskApi = {
  getAllTasks: async () => {
    return fetchApi("/tasks");
  },
  
  getTasksByUser: async (userId: string) => {
    return fetchApi(`/tasks/user/${userId}`);
  },
  
  createTask: async (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    return fetchApi("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  },
  
  updateTaskStatus: async (taskId: string, status: "pending" | "completed") => {
    return fetchApi(`/tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  
  deleteTask: async (taskId: string) => {
    return fetchApi(`/tasks/${taskId}`, {
      method: "DELETE",
    });
  }
};

// User APIs
export const userApi = {
  getAllUsers: async () => {
    return fetchApi("/users");
  },
  
  getUserById: async (userId: string) => {
    return fetchApi(`/users/${userId}`);
  }
};

