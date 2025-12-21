import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import "./fonts.css";
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { toast, Toaster } from "sonner";
import { auth } from "@/context/auth.tsx";
import { ErrorComponent } from "./components/error.tsx";
import { NotFoundComponent } from "./components/not-found.tsx";
import { ApiError } from "@/lib/api-error.ts";
import { getFormatedDate } from "@/lib/utils.ts";
import { ErrorCodes } from "@neochef/common";
import { formatDuration } from "./lib/format-duration.ts";
import config from "./config.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.cacheStaleTimeSeconds * 1000,
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          error.errorCode === ErrorCodes.AUTH_EXPIRED
        )
          return false;
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
  if (
    error instanceof ApiError &&
    error.errorCode === ErrorCodes.AUTH_EXPIRED
  ) {
    queryClient.clear();
    toast.error("Your session has expired. Please login again.", {
      description: getFormatedDate() + " 📆",
      id: "session-expired",
    });
    router.invalidate();
  } else if (
    error instanceof ApiError &&
    error.errorCode === ErrorCodes.RL_EXCEEDED
  ) {
    let message = "Top many requests. Please slow down.";

    if (error.retryAfter) {
      const now = Date.now();
      const resetTime = error.retryAfter * 1000;
      const diffSeconds = Math.ceil((resetTime - now) / 1000);

      if (diffSeconds > 0) {
        const timeString = formatDuration(diffSeconds);
        message = `Too many requests. Try again in ${timeString}.`;
      }
    }

    toast.error(message, {
      description: getFormatedDate() + " 📆",
      id: "rate-limit",
    });
  } else if (error instanceof ApiError && error.statusCode >= 500) {
    toast.error("Oops! Something went wrong. Please try again later.", {
      description: getFormatedDate() + " 📆",
      id: "server-error",
    });
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
      <Toaster expand={true} position="top-right" />
    </QueryClientProvider>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
