import { useState } from "react";
import { format, parseISO, isPast, isWithinInterval, addDays } from "date-fns";
import { Plus, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VaccineCard from "@/components/vaccine-card";
import AddVaccineDialog from "@/components/add-vaccine-dialog";
import { useVaccines } from "@/hooks/use-vaccines";

const Vaccines = () => {
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const { data: vaccines = [], isLoading } = useVaccines();

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const upcomingVaccines = vaccines.filter(vaccine => {
    if (vaccine.completed) return false;
    const dueDate = parseISO(vaccine.dueDate);
    return !isPast(dueDate) || isPast(dueDate);
  });

  const overdueVaccines = vaccines.filter(vaccine => {
    if (vaccine.completed) return false;
    const dueDate = parseISO(vaccine.dueDate);
    return isPast(dueDate);
  });

  const dueSoonVaccines = vaccines.filter(vaccine => {
    if (vaccine.completed) return false;
    const dueDate = parseISO(vaccine.dueDate);
    return !isPast(dueDate) && isWithinInterval(dueDate, {
      start: today,
      end: addDays(today, 30)
    });
  });

  const completedVaccines = vaccines.filter(vaccine => vaccine.completed);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Vaccine Schedule</h2>
        <Button
          onClick={() => setShowAddVaccine(true)}
          className="bg-pet-secondary hover:bg-amber-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      </div>

      {vaccines.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">💉</div>
            <p className="text-gray-600 mb-4">No vaccines scheduled</p>
            <Button onClick={() => setShowAddVaccine(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule First Vaccine
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overdue Vaccines */}
          {overdueVaccines.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Overdue
              </h3>
              <div className="space-y-3">
                {overdueVaccines.map(vaccine => (
                  <VaccineCard key={vaccine.id} vaccine={vaccine} variant="overdue" />
                ))}
              </div>
            </div>
          )}

          {/* Due Soon Vaccines */}
          {dueSoonVaccines.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                Due Soon
              </h3>
              <div className="space-y-3">
                {dueSoonVaccines.map(vaccine => (
                  <VaccineCard key={vaccine.id} vaccine={vaccine} variant="upcoming" />
                ))}
              </div>
            </div>
          )}

          {/* Completed Vaccines */}
          {completedVaccines.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Completed
              </h3>
              <div className="space-y-3">
                {completedVaccines.map(vaccine => (
                  <VaccineCard key={vaccine.id} vaccine={vaccine} variant="completed" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AddVaccineDialog open={showAddVaccine} onOpenChange={setShowAddVaccine} />
    </div>
  );
};

export default Vaccines;
