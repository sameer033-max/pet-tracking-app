import { useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TaskItem from "@/components/task-item";
import AddTaskDialog from "@/components/add-task-dialog";
import { usePets } from "@/hooks/use-pets";
import { useTasks } from "@/hooks/use-tasks";

const Tasks = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");
  
  const { data: pets = [], isLoading: petsLoading } = usePets();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(today);

  if (petsLoading || tasksLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const getTasksByPet = () => {
    return pets.map(pet => ({
      pet,
      tasks: tasks.filter(task => task.petId === pet.id)
    }));
  };

  const petTasks = getTasksByPet();

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Daily Tasks</h2>
          <Button
            onClick={() => setShowAddTask(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
        <p className="text-gray-600">Manage your pet's daily routines</p>
      </div>

      <div className="p-6">
        {pets.length === 0 ? (
          <Card className="border-2 border-dashed border-purple-200 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <p className="text-gray-700 mb-6 text-lg">No pets added yet</p>
              <p className="text-sm text-gray-500">Add a pet first to create tasks</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {petTasks.map(({ pet, tasks: petTaskList }) => {
              const completedTasks = petTaskList.filter(task => task.completed).length;
              const totalTasks = petTaskList.length;
              
              const petTypeGradient = pet.type === "dog" 
                ? "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200" 
                : pet.type === "cat" 
                ? "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200" 
                : "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200";

              return (
                <Card key={pet.id} className={`${petTypeGradient} shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md">
                        {pet.photoUrl ? (
                          <img
                            src={pet.photoUrl}
                            alt={pet.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="text-xl">
                            {pet.type === "dog" ? "🐕" : pet.type === "cat" ? "🐱" : "🐾"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{pet.name}'s Tasks</h3>
                        <span className="text-sm text-gray-600 font-medium">
                          {completedTasks}/{totalTasks} completed
                        </span>
                      </div>
                    </div>
                    
                    {petTaskList.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        No tasks for today
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {petTaskList.map(task => (
                          <TaskItem key={task.id} task={task} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
      </div>
    </div>
  );
};

export default Tasks;
