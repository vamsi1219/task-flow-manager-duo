
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser) {
      if (isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    }
  }, [currentUser, isAdmin, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Task Management System</h1>
          <p className="text-gray-600 mt-2">Log in to manage your tasks</p>
        </div>
        <LoginForm />
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-1">For demonstration, use these credentials:</p>
          <p><strong>Admin:</strong> admin@example.com / admin123</p>
          <p><strong>Employee:</strong> employee1@example.com / employee1</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
