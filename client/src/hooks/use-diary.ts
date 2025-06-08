import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { DiaryEntry, InsertDiaryEntry } from "@shared/schema";

export function useDiary() {
  return useQuery<(DiaryEntry & { petName: string })[]>({
    queryKey: ["/api/diary"],
  });
}

export function useCreateDiaryEntry() {
  return useMutation({
    mutationFn: async (data: InsertDiaryEntry) => {
      const response = await apiRequest("POST", "/api/diary", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
    },
  });
}

export function useUpdateDiaryEntry() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertDiaryEntry> }) => {
      const response = await apiRequest("PUT", `/api/diary/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
    },
  });
}

export function useDeleteDiaryEntry() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/diary/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
    },
  });
}
