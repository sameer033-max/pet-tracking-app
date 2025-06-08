import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DiaryEntry as DiaryEntryType } from "@shared/schema";

interface DiaryEntryProps {
  entry: DiaryEntryType & { petName: string };
}

const DiaryEntry = ({ entry }: DiaryEntryProps) => {
  const getMoodEmoji = (mood: string | null) => {
    if (!mood) return "😊";
    const moodLower = mood.toLowerCase();
    if (moodLower.includes("happy")) return "😄";
    if (moodLower.includes("content")) return "😌";
    if (moodLower.includes("excited")) return "🤩";
    if (moodLower.includes("tired")) return "😴";
    if (moodLower.includes("sad")) return "😢";
    return "😊";
  };

  const getEnergyColor = (energy: string | null) => {
    if (!energy) return "bg-gray-100 text-gray-800";
    const energyLower = energy.toLowerCase();
    if (energyLower === "high") return "bg-red-100 text-red-800";
    if (energyLower === "medium") return "bg-yellow-100 text-yellow-800";
    if (energyLower === "low") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatDateTime = () => {
    try {
      const dateTime = `${entry.date} ${entry.time}`;
      const date = parseISO(dateTime);
      return format(date, "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return `${entry.date} at ${entry.time}`;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-pet-primary/10 flex items-center justify-center">
            <span className="text-lg">🐾</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800">{entry.petName}</h3>
              <span className="text-sm text-gray-500">{formatDateTime()}</span>
            </div>
            <p className="text-gray-700 mb-3">{entry.content}</p>
            
            {entry.photoUrl && (
              <img
                src={entry.photoUrl}
                alt="Diary entry"
                className="rounded-lg w-full h-32 object-cover mb-3"
              />
            )}
            
            <div className="flex items-center gap-3 text-sm">
              {entry.mood && (
                <div className="flex items-center gap-1">
                  <span>{getMoodEmoji(entry.mood)}</span>
                  <span className="text-gray-600">Mood: {entry.mood}</span>
                </div>
              )}
              
              {entry.energy && (
                <Badge variant="secondary" className={getEnergyColor(entry.energy)}>
                  Energy: {entry.energy}
                </Badge>
              )}
              
              {entry.activity && (
                <div className="flex items-center gap-1">
                  <span>🎯</span>
                  <span className="text-gray-600">Activity: {entry.activity}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiaryEntry;
