import { format, parseISO, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdateVaccine } from "@/hooks/use-vaccines";
import type { Vaccine } from "@shared/schema";

interface VaccineCardProps {
  vaccine: Vaccine & { petName: string };
  variant: "overdue" | "upcoming" | "completed";
}

const VaccineCard = ({ vaccine, variant }: VaccineCardProps) => {
  const updateVaccine = useUpdateVaccine();
  
  const dueDate = parseISO(vaccine.dueDate);
  const today = new Date();
  const daysDiff = differenceInDays(dueDate, today);
  
  const getVariantStyles = () => {
    switch (variant) {
      case "overdue":
        return "bg-red-50 border-red-200";
      case "upcoming":
        return "bg-yellow-50 border-yellow-200";
      case "completed":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case "overdue":
        return <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">!</div>;
      case "upcoming":
        return <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">⏰</div>;
      case "completed":
        return <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>;
      default:
        return <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white">💉</div>;
    }
  };

  const getDateText = () => {
    if (variant === "completed") {
      return `Completed: ${format(dueDate, "MMMM d, yyyy")}`;
    }
    
    if (daysDiff < 0) {
      return `Overdue by ${Math.abs(daysDiff)} day${Math.abs(daysDiff) !== 1 ? 's' : ''}`;
    }
    
    if (daysDiff === 0) {
      return "Due today";
    }
    
    if (daysDiff <= 7) {
      return `Due in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;
    }
    
    return `Due: ${format(dueDate, "MMMM d, yyyy")}`;
  };

  const handleMarkComplete = async () => {
    await updateVaccine.mutateAsync({
      id: vaccine.id,
      data: { completed: true }
    });
  };

  return (
    <Card className={`border ${getVariantStyles()}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {getVariantIcon()}
          <div className="flex-1">
            <h4 className="font-bold text-gray-800">
              {vaccine.petName} - {vaccine.name}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{getDateText()}</p>
            
            {variant === "overdue" && (
              <p className="text-sm text-red-600 font-medium mb-3">
                Overdue by {Math.abs(daysDiff)} days
              </p>
            )}
            
            {vaccine.veterinarian && (
              <div className="flex items-center gap-2 mb-3">
                <div className="text-sm text-gray-600">
                  🏥 {vaccine.veterinarian}
                </div>
              </div>
            )}
            
            {vaccine.notes && (
              <p className="text-sm text-gray-600 mb-3">{vaccine.notes}</p>
            )}
            
            {!vaccine.completed && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleMarkComplete}
                  disabled={updateVaccine.isPending}
                  className={variant === "overdue" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"}
                >
                  {variant === "overdue" ? "Complete Now" : "Mark Complete"}
                </Button>
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VaccineCard;
