import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AddPetDialog from "@/components/add-pet-dialog";
import { usePets } from "@/hooks/use-pets";

const Pets = () => {
  const [showAddPet, setShowAddPet] = useState(false);
  const { data: pets = [], isLoading } = usePets();

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Pets</h2>
        <Button
          onClick={() => setShowAddPet(true)}
          className="bg-pet-primary hover:bg-indigo-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">🐾</div>
            <p className="text-gray-600 mb-4">No pets added yet</p>
            <Button onClick={() => setShowAddPet(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Pet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pets.map(pet => {
            const petTypeGradient = pet.type === "dog" 
              ? "pet-gradient-orange" 
              : pet.type === "cat" 
              ? "pet-gradient-purple" 
              : "bg-gradient-to-r from-blue-100 to-indigo-100";

            return (
              <Card key={pet.id} className={`${petTypeGradient} border-0 shadow-sm`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center pet-avatar">
                      {pet.photoUrl ? (
                        <img
                          src={pet.photoUrl}
                          alt={pet.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="text-3xl">
                          {pet.type === "dog" ? "🐕" : pet.type === "cat" ? "🐱" : "🐾"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                      <p className="text-gray-600">{pet.breed}</p>
                      <p className="text-sm text-gray-500">{pet.age} years old</p>
                      <p className="text-sm text-gray-500 capitalize">{pet.type}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddPetDialog open={showAddPet} onOpenChange={setShowAddPet} />
    </div>
  );
};

export default Pets;
