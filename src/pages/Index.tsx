
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index: React.FC = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-3xl w-full px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Task Management System</h1>
        <p className="text-xl text-gray-600 mb-8">
          A simple platform for assigning and tracking tasks between admins and employees.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">For Administrators</h2>
            <ul className="text-left space-y-2 mb-6">
              <li>✓ Assign tasks to employees</li>
              <li>✓ Track task completion status</li>
              <li>✓ View employee performance</li>
              <li>✓ Manage deadlines</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">For Employees</h2>
            <ul className="text-left space-y-2 mb-6">
              <li>✓ View assigned tasks</li>
              <li>✓ Mark tasks as completed</li>
              <li>✓ Track your performance</li>
              <li>✓ Never miss deadlines</li>
            </ul>
          </div>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => navigate("/login")}
          className="px-8"
        >
          Get Started
        </Button>
        
        <div className="mt-8 text-sm text-gray-500">
          <p><strong>Demo Credentials:</strong></p>
          <p className="mt-1"><strong>Admin:</strong> admin@example.com / admin123</p>
          <p><strong>Employee:</strong> employee1@example.com / employee1</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
