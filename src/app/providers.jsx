import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/stores/appStore";
import { NotificationsProvider } from "@/features/notifications";

export function AppProviders({ children }) {
  return (
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
  );
}
