import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

let parsedUser = null;

try {
  parsedUser = savedUser ? JSON.parse(savedUser) : null;
} catch {
  parsedUser = null;
}

const initialState = {
  user: parsedUser,
  token: savedToken || null,
  isAuthenticated: Boolean(savedToken),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (state, action) => {
      const data = action.payload || {};

      const user = data.user || {
        username: data.username || "",
        role: data.role || "ROLE_USER",
      };

      state.user = user;
      state.token = data.token || null;
      state.isAuthenticated = Boolean(data.token);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("user", JSON.stringify(user));
    },

    setCredentials: (state, action) => {
      const data = action.payload || {};

      state.user = data.user || null;
      state.token = data.token || null;
      state.isAuthenticated = Boolean(data.token);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const {
  login,
  setCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;