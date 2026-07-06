import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/stores/appStore";
import { NotificationsProvider } from "@/features/notifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {/*
          PersistGate delays rendering until the persisted auth state is
          rehydrated from localStorage — prevents a flash of "logged out" UI.
          loading={null} renders nothing during rehydration (instant in practice).
        */}
        <PersistGate loading={null} persistor={persistor}>
          <NotificationsProvider>{children}</NotificationsProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
