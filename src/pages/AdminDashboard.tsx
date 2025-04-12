
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import Header from "@/components/Header";
import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { tasks, getAllUsers, getPendingTasksCount, getCompletedTasksCount } = useTask();
  
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/employee/dashboard" />;
  }
  
  const employees = getAllUsers();
  const pendingTasks = tasks.filter(task => task.status === "pending");
  const completedTasks = tasks.filter(task => task.status === "completed");
  
  const getEmployeeNameById = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : "Unknown";
  };
  
  const calculateCompletionRate = (userId: string) => {
    const completed = getCompletedTasksCount(userId);
    const pending = getPendingTasksCount(userId);
    const total = completed + pending;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Task Management</h2>
          <TaskForm />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Tasks</CardTitle>
              <CardDescription>All assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Tasks</CardTitle>
              <CardDescription>Tasks awaiting completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Tasks</CardTitle>
              <CardDescription>Successfully finished tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedTasks.length}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Employee Performance</CardTitle>
            <CardDescription>Task completion rates by employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => {
                const completionRate = calculateCompletionRate(employee.id);
                return (
                  <div key={employee.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{employee.name}</span>
                      <span className="text-sm">
                        {getCompletedTasksCount(employee.id)} / {getCompletedTasksCount(employee.id) + getPendingTasksCount(employee.id)} tasks
                      </span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    showActions={false}
                    assigneeName={getEmployeeNameById(task.assignedTo)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  No tasks found. Start by assigning a new task.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    showActions={false}
                    assigneeName={getEmployeeNameById(task.assignedTo)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  No pending tasks found.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    showActions={false}
                    assigneeName={getEmployeeNameById(task.assignedTo)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  No completed tasks found.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
