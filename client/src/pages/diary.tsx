import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DiaryEntry from "@/components/diary-entry";
import AddDiaryDialog from "@/components/add-diary-dialog";
import { useDiary } from "@/hooks/use-diary";

const Diary = () => {
  const [showAddEntry, setShowAddEntry] = useState(false);
  const { data: entries = [], isLoading } = useDiary();

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Pet Diary</h2>
        <Button
          onClick={() => setShowAddEntry(true)}
          className="bg-pet-accent hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">📖</div>
            <p className="text-gray-600 mb-4">No diary entries yet</p>
            <Button onClick={() => setShowAddEntry(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <DiaryEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <AddDiaryDialog open={showAddEntry} onOpenChange={setShowAddEntry} />
    </div>
  );
};

export default Diary;
