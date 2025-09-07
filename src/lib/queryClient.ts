import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // This handles session cookies automatically
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include", // This handles session cookies automatically
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 401
        if (error instanceof Error && error.message.match(/^4[0-9][0-9]/)) {
          if (error.message.includes('401')) {
            return false; // Don't retry auth errors
          }
          return false; // Don't retry other 4xx errors
        }
        // Retry up to 2 times for network errors
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
      onError: (error) => {
        // Global mutation error handler to prevent unhandled promise rejections
        console.error('Mutation error:', error);
        if (error instanceof Error && error.message.includes('401')) {
          // Auth errors handled by individual components
          return;
        }
        // Log other errors but don't show toast to avoid conflicts with component-level handling
      },
    },
  },
});
