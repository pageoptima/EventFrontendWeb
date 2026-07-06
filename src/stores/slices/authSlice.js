import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null, // { id, name, email, role } — decoded from JWT on login/register
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user ?? null;
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.user = null;
    },
    patchUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, clearCredentials, patchUser } = authSlice.actions;

// Selectors
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.accessToken);

export default authSlice.reducer;
