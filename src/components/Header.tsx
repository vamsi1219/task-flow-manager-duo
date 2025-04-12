
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, LogOut, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary">
            {isAdmin() ? "Admin Dashboard" : "Employee Dashboard"}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser && (
            <>
              <span className="text-sm font-medium">
                Welcome, {currentUser.name}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-secondary">
                  {currentUser.role}
                </span>
              </span>
              
              {isAdmin() && (
                <Link to="/register">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    Add Employee
                  </Button>
                </Link>
              )}
              
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
