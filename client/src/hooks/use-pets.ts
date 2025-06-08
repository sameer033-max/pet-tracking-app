import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Pet, InsertPet } from "@shared/schema";

export function usePets() {
  return useQuery<Pet[]>({
    queryKey: ["/api/pets"],
  });
}

export function useCreatePet() {
  return useMutation({
    mutationFn: async (data: InsertPet) => {
      const response = await apiRequest("POST", "/api/pets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
    },
  });
}

export function useUpdatePet() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPet> }) => {
      const response = await apiRequest("PUT", `/api/pets/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
    },
  });
}

export function useDeletePet() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/pets/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
    },
  });
}
