import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export function useAuth() {
  const { toast } = useToast();
  
  // Simplified approach - don't block on user fetch for auth page
  const { data: user, isLoading: queryLoading, error } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await fetch("/api/user", {
        credentials: "include"
      });
      
      if (res.status === 401) {
        return null; // Not authenticated
      }
      
      if (!res.ok) {
        return null; // Default to not authenticated
      }
      
      return await res.json();
    },
    retry: false,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // For auth page, don't show loading after initial attempt but still track query state
  const isLoading = queryLoading;

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to Step Up Naija.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome to Step Up Naija!",
        description: `Registration successful! You are citizen #${user.citizenNumber || 'TBD'}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed", 
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      queryClient.clear(); // Clear all cached data on logout
      toast({
        title: "Logged Out",
        description: "See you next time!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Logout Failed",
        description: error.message || "Logout failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    loginMutation,
    registerMutation,
    logoutMutation,
  };
}