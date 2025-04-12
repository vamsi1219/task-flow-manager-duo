
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmployeeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { getTasksForUser, getPendingTasksCount, getCompletedTasksCount, completeTask } = useTask();
  
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  
  const userTasks = getTasksForUser(currentUser.id);
  const pendingTasks = userTasks.filter(task => task.status === "pending");
  const completedTasks = userTasks.filter(task => task.status === "completed");
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Tasks</CardTitle>
              <CardDescription>All your assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Tasks</CardTitle>
              <CardDescription>Tasks awaiting your completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getPendingTasksCount(currentUser.id)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Tasks</CardTitle>
              <CardDescription>Your finished tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getCompletedTasksCount(currentUser.id)}</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onComplete={() => completeTask(task.id)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  You have no pending tasks. Great job!
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
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  You haven't completed any tasks yet.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
