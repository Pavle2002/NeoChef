import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/index.css";
import Root from "@/root";
import AuthLayout from "@/layouts/auth-layout";
import Login from "@/pages/login-page";
import Register from "@/pages/register-page";
import Home from "./pages/home-page";
import { toast, Toaster } from "sonner";
import { NetworkError } from "./lib/errors";
import ProtectedRoute from "./components/protected-route";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        Component: AuthLayout, // Wrap auth routes with AuthLayout
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: "home",
            Component: Home,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof NetworkError)
        toast.error("Oops... Something went wrong", {
          description: "Please check your internet connection 📶",
        });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof NetworkError)
        toast.error("Oops... Something went wrong", {
          description: "Please check your internet connection 📶",
        });
    },
  }),
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <Toaster />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen />
    </PersistQueryClientProvider>
  </StrictMode>
);
