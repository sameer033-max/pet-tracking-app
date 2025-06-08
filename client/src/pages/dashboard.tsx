import { useState } from "react";
import { format } from "date-fns";
import { Plus, Calendar, PenTool, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PetCard from "@/components/pet-card";
import AddPetDialog from "@/components/add-pet-dialog";
import AddTaskDialog from "@/components/add-task-dialog";
import AddVaccineDialog from "@/components/add-vaccine-dialog";
import AddDiaryDialog from "@/components/add-diary-dialog";
import { usePets } from "@/hooks/use-pets";
import { useTasks } from "@/hooks/use-tasks";

const Dashboard = () => {
  const [showAddPet, setShowAddPet] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddDiary, setShowAddDiary] = useState(false);

  const { data: pets = [], isLoading: petsLoading } = usePets();
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(today);

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  if (petsLoading || tasksLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <section className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-600">Let's take care of your furry friends</p>
          </div>
          <Button
            onClick={() => setShowAddPet(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pet
          </Button>
        </div>

        {pets.length === 0 ? (
          <Card className="border-2 border-dashed border-purple-200 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🐾</span>
              </div>
              <p className="text-gray-700 mb-6 text-lg">No pets added yet</p>
              <Button 
                onClick={() => setShowAddPet(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Pet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} tasks={tasks.filter(t => t.petId === pet.id)} />
            ))}
          </div>
        )}
      </section>

      {pets.length > 0 && (
        <>
          {/* Today's Summary */}
          <section className="px-6 pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Today's Progress</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-emerald-600">{completedTasks}</p>
                      <p className="text-sm text-emerald-700 font-medium">Tasks Done</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white text-lg">✓</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-amber-600">{pendingTasks}</p>
                      <p className="text-sm text-amber-700 font-medium">Pending</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white text-lg">⏰</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="px-6 pb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl p-6 h-auto flex-col items-center shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowAddTask(true)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="font-semibold text-base">Add Task</p>
                <p className="text-xs opacity-90 mt-1">Create new routine</p>
              </Button>
              
              <Button
                className="bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl p-6 h-auto flex-col items-center shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowAddVaccine(true)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="font-semibold text-base">Schedule</p>
                <p className="text-xs opacity-90 mt-1">Vaccine reminder</p>
              </Button>
              
              <Button
                className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl p-6 h-auto flex-col items-center shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowAddDiary(true)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <PenTool className="w-6 h-6" />
                </div>
                <p className="font-semibold text-base">Add Note</p>
                <p className="text-xs opacity-90 mt-1">Diary entry</p>
              </Button>
              
              <Button
                className="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-2xl p-6 h-auto flex-col items-center shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="font-semibold text-base">Reports</p>
                <p className="text-xs opacity-90 mt-1">Coming soon</p>
              </Button>
            </div>
          </section>
        </>
      )}

      {/* Dialogs */}
      <AddPetDialog open={showAddPet} onOpenChange={setShowAddPet} />
      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
      <AddVaccineDialog open={showAddVaccine} onOpenChange={setShowAddVaccine} />
      <AddDiaryDialog open={showAddDiary} onOpenChange={setShowAddDiary} />
    </div>
  );
};

export default Dashboard;
