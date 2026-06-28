import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/stores/slices/authSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  // Only persist token + user — never loading/error transient state
  whitelist: ["accessToken", "user"],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches non-serializable actions internally
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
