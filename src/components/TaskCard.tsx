
import React from "react";
import { Task } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onComplete?: () => void;
  showActions?: boolean;
  assigneeName?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  showActions = true,
  assigneeName,
}) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status === "pending";
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Card className={`border-l-4 ${
      task.status === "completed" 
        ? "border-l-task-completed" 
        : isOverdue 
          ? "border-l-task-overdue" 
          : "border-l-task-pending"
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <Badge variant={task.status === "completed" ? "outline" : "default"}>
            {task.status === "completed" ? "Completed" : "Pending"}
          </Badge>
        </div>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span>Due: {formatDate(task.dueDate)}</span>
        </div>
        
        {assigneeName && (
          <div className="mt-2 text-sm text-muted-foreground">
            Assigned to: {assigneeName}
          </div>
        )}
        
        {task.completedAt && (
          <div className="mt-2 text-sm text-green-600">
            Completed on: {formatDate(task.completedAt)}
          </div>
        )}
      </CardContent>
      
      {showActions && task.status === "pending" && (
        <CardFooter className="pt-2">
          <Button 
            onClick={onComplete} 
            variant="outline"
            className="w-full"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Completed
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TaskCard;
