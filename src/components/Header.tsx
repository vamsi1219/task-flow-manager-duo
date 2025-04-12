
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, LogOut } from "lucide-react";

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
