import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateDiaryEntry } from "@/hooks/use-diary";
import { usePets } from "@/hooks/use-pets";
import { insertDiaryEntrySchema } from "@shared/schema";
import { z } from "zod";

const formSchema = insertDiaryEntrySchema.extend({
  petId: z.number().min(1, "Please select a pet"),
});

type FormData = z.infer<typeof formSchema>;

interface AddDiaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddDiaryDialog = ({ open, onOpenChange }: AddDiaryDialogProps) => {
  const createEntry = useCreateDiaryEntry();
  const { data: pets = [] } = usePets();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petId: 0,
      content: "",
      mood: "",
      energy: "",
      activity: "",
      photoUrl: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createEntry.mutateAsync(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create diary entry:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Diary Entry</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="petId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pets.map(pet => (
                        <SelectItem key={pet.id} value={pet.id.toString()}>
                          {pet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What happened today?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="happy">Happy</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="excited">Excited</SelectItem>
                        <SelectItem value="tired">Tired</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                        <SelectItem value="calm">Calm</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="energy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Energy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Energy level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., playing, eating, sleeping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createEntry.isPending}
                className="flex-1"
              >
                {createEntry.isPending ? "Adding..." : "Add Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDiaryDialog;
