import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, InsertTask } from "@shared/schema";

export function useTasks(date: string) {
  return useQuery<(Task & { petName: string })[]>({
    queryKey: ["/api/tasks", date],
    queryFn: async () => {
      const response = await fetch(`/api/tasks?date=${date}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return response.json();
    },
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: async (data: InsertTask) => {
      const response = await apiRequest("POST", "/api/tasks", data);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", variables.date] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTask> }) => {
      const response = await apiRequest("PUT", `/api/tasks/${id}`, data);
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", result.date] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/tasks/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });
}
