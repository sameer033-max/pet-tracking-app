import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateVaccine } from "@/hooks/use-vaccines";
import { usePets } from "@/hooks/use-pets";
import { insertVaccineSchema } from "@shared/schema";
import { z } from "zod";

const formSchema = insertVaccineSchema.extend({
  petId: z.number().min(1, "Please select a pet"),
});

type FormData = z.infer<typeof formSchema>;

interface AddVaccineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddVaccineDialog = ({ open, onOpenChange }: AddVaccineDialogProps) => {
  const createVaccine = useCreateVaccine();
  const { data: pets = [] } = usePets();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petId: 0,
      name: "",
      dueDate: "",
      completed: false,
      notes: "",
      veterinarian: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createVaccine.mutateAsync(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create vaccine:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Vaccine</DialogTitle>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rabies, DHPP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="veterinarian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veterinarian (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Smith's Clinic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
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
                disabled={createVaccine.isPending}
                className="flex-1"
              >
                {createVaccine.isPending ? "Scheduling..." : "Schedule"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVaccineDialog;
