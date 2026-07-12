import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/stores/appStore";
import { NotificationsProvider } from "@/features/notifications";
import { selectThemeMode } from "@/stores/slices/themeSlice";
import { queryClient } from "@/lib/queryClient";

function ThemeApplicator() {
  const mode = useSelector(selectThemeMode);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  return null;
}

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
          <ThemeApplicator />
          <NotificationsProvider>{children}</NotificationsProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
