
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "./AuthContext";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  assignedBy: string;
  status: "pending" | "completed";
  createdAt: string;
  completedAt?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  completeTask: (id: string) => void;
  getTasksForUser: (userId: string) => Task[];
  getPendingTasksCount: (userId: string) => number;
  getCompletedTasksCount: (userId: string) => number;
  getAllUsers: () => User[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Mock employees for demo
const MOCK_EMPLOYEES = [
  {
    id: "2",
    name: "Employee 1",
    email: "employee1@example.com",
    role: "employee" as const,
  },
  {
    id: "3",
    name: "Employee 2",
    email: "employee2@example.com",
    role: "employee" as const,
  },
];

// Sample tasks for demo
const INITIAL_TASKS = [
  {
    id: "1",
    title: "Complete UI Design",
    description: "Finish the UI design for the new dashboard",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days from now
    assignedTo: "2",
    assignedBy: "1",
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Fix Login Bug",
    description: "Fix the login issue users are experiencing",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // 1 day from now
    assignedTo: "2",
    assignedBy: "1",
    status: "completed" as const,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    completedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Write Documentation",
    description: "Create documentation for the API endpoints",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0], // 3 days from now
    assignedTo: "3",
    assignedBy: "1",
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  },
];

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
  });
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (
    taskData: Omit<Task, "id" | "createdAt" | "status">
  ) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    setTasks([...tasks, newTask]);
    
    toast({
      title: "Task created",
      description: "The task has been successfully assigned.",
    });
  };

  const completeTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: "completed", completedAt: new Date().toISOString() }
          : task
      )
    );
    
    toast({
      title: "Task completed",
      description: "Great job! The task has been marked as completed.",
    });
  };

  const getTasksForUser = (userId: string) => {
    return tasks.filter((task) => task.assignedTo === userId);
  };

  const getPendingTasksCount = (userId: string) => {
    return tasks.filter(
      (task) => task.assignedTo === userId && task.status === "pending"
    ).length;
  };

  const getCompletedTasksCount = (userId: string) => {
    return tasks.filter(
      (task) => task.assignedTo === userId && task.status === "completed"
    ).length;
  };

  const getAllUsers = () => {
    return MOCK_EMPLOYEES;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        completeTask,
        getTasksForUser,
        getPendingTasksCount,
        getCompletedTasksCount,
        getAllUsers,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
