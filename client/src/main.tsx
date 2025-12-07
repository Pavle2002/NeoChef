import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { toast, Toaster } from "sonner";
import { auth } from "@/context/auth.tsx";
import { ErrorComponent } from "./components/error.tsx";
import { NotFoundComponent } from "./components/not-found.tsx";
import { ApiError } from "@/lib/api-error.ts";
import { getFormatedDate } from "@/lib/utils.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.statusCode === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

const router = createRouter({
  defaultPendingComponent: () => (
    <div className="flex flex-1 items-center justify-center h-full w-full">
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ reset }) => (
    <ErrorComponent
      reset={() => {
        queryClient.resetQueries();
        reset();
      }}
    />
  ),
  defaultNotFoundComponent: () => (
    <div className="h-screen">
      <NotFoundComponent />
    </div>
  ),
  defaultPendingMs: 500,
  routeTree,
  context: {
    queryClient,
    auth,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const handleGlobalError = (error: Error) => {
  if (error instanceof ApiError && error.statusCode === 401) {
    queryClient.clear();
    toast.error("Your session has expired. Please login again.", {
      description: getFormatedDate() + " 📆",
    });
    router.invalidate();
  }
};

queryClient.getQueryCache().config.onError = handleGlobalError;
queryClient.getMutationCache().config.onError = handleGlobalError;

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster expand={true} />
    </QueryClientProvider>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
