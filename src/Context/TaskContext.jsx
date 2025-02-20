import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "./AuthProvider";

export const TaskContext = createContext();

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://task-mate-server-gold.vercel.app",
  withCredentials: true,
});

export const TaskProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Query for fetching tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get(`/tasks/${user?.email}`);
      return res.data;
    },
    enabled: !!user,
  });

  const { mutateAsync: addTask } = useMutation({
    mutationFn: async (newTask) => {
      const res = await axiosInstance.post("/tasks", {
        ...newTask,
        email: user?.email,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
    },
  });
  // Mutation for updating task
  const { mutate: updateTask } = useMutation({
    mutationFn: async ({ id, updatedTask }) => {
      const res = await axiosInstance.patch(`/tasks/${id}`, updatedTask);
      return res.data;
    },
    onMutate: async ({ id, updatedTask }) => {
      // Cancel outgoing fetches
      await queryClient.cancelQueries(["tasks", user?.email]);

      // Get current tasks
      const previousTasks = queryClient.getQueryData(["tasks", user?.email]);

      // Optimistically update the cache
      queryClient.setQueryData(["tasks", user?.email], (old) =>
        old.map((task) =>
          task._id === id ? { ...task, ...updatedTask } : task
        )
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(["tasks", user?.email], context.previousTasks);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries(["tasks", user?.email]);
    },
  });

  // Delete task mutation
  const { mutateAsync: deleteTask } = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/tasks/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
    },
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        updateTask,
        isLoading,
        deleteTask,
        addTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
