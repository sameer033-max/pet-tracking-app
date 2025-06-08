import { MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Pet, Task } from "@shared/schema";

interface PetCardProps {
  pet: Pet;
  tasks: Task[];
}

const PetCard = ({ pet, tasks }: PetCardProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  
  const getStatusColor = () => {
    if (totalTasks === 0) return "bg-gray-500";
    if (completedTasks === totalTasks) return "bg-green-500";
    return "bg-yellow-500";
  };

  const getStatusText = () => {
    if (totalTasks === 0) return "No tasks today";
    if (completedTasks === totalTasks) return "All tasks completed today";
    return `${totalTasks - completedTasks} tasks remaining`;
  };

  const petTypeGradient = pet.type === "dog" 
    ? "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200" 
    : pet.type === "cat" 
    ? "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200" 
    : "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200";

  return (
    <Card className={`${petTypeGradient} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md border-2 border-white/50">
            {pet.photoUrl ? (
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="text-3xl">
                {pet.type === "dog" ? "🐕" : pet.type === "cat" ? "🐱" : "🐾"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{pet.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{pet.breed} • {pet.age} years old</p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()} shadow-sm`}></div>
              <span className="text-xs text-gray-700 font-medium">{getStatusText()}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-xl p-2"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCard;
