import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdateTask } from "@/hooks/use-tasks";
import type { Task } from "@shared/schema";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateTask = useUpdateTask();

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: { completed: checked }
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getTaskIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("walk")) return "🚶";
    if (titleLower.includes("feed") || titleLower.includes("food") || titleLower.includes("breakfast") || titleLower.includes("dinner")) return "🍽️";
    if (titleLower.includes("brush")) return "✨";
    if (titleLower.includes("litter")) return "🧹";
    if (titleLower.includes("play")) return "🎾";
    if (titleLower.includes("medicine") || titleLower.includes("medication")) return "💊";
    return "📋";
  };

  return (
    <Card className="bg-white border border-gray-100">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
          />
          <div className="flex-1">
            <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </p>
            {task.time && (
              <p className="text-sm text-gray-500">{task.time}</p>
            )}
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </div>
          <div className="text-gray-400">
            {getTaskIcon(task.title)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
