import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Vaccine, InsertVaccine } from "@shared/schema";

export function useVaccines() {
  return useQuery<(Vaccine & { petName: string })[]>({
    queryKey: ["/api/vaccines"],
  });
}

export function useCreateVaccine() {
  return useMutation({
    mutationFn: async (data: InsertVaccine) => {
      const response = await apiRequest("POST", "/api/vaccines", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccines"] });
    },
  });
}

export function useUpdateVaccine() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertVaccine> }) => {
      const response = await apiRequest("PUT", `/api/vaccines/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccines"] });
    },
  });
}

export function useDeleteVaccine() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/vaccines/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccines"] });
    },
  });
}
