// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const storedUser = localStorage.getItem("user");
// const storedToken = localStorage.getItem("token");

// let parsedUser = null;

// try {
//   parsedUser = storedUser
//     ? JSON.parse(storedUser)
//     : null;
// } catch (error) {
//   parsedUser = null;
// }

// export const login = createAsyncThunk(
//   "auth/login",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "/api/auth/login",
//         credentials
//       );

//       const data = response?.data || {};

//       const token = data.token;

//       if (token) {
//         localStorage.setItem("token", token);
//       }

//       /*
//        * Store the complete response object.
//        * This is also important for the test which expects:
//        * state.auth.user.role === "ADMIN"
//        */
//       localStorage.setItem(
//         "user",
//         JSON.stringify(data)
//       );

//       return data;
//     } catch (error) {
//       let errorMessage =
//         "Invalid username or password.";

//       if (error?.response?.data) {
//         if (
//           typeof error.response.data ===
//           "string"
//         ) {
//           errorMessage =
//             error.response.data;
//         } else {
//           errorMessage =
//             error.response.data.message ||
//             error.response.data.error ||
//             errorMessage;
//         }
//       }

//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const register = createAsyncThunk(
//   "auth/register",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response =
//         await axios.post(
//           "/api/auth/register",
//           userData
//         );

//       return response?.data;
//     } catch (error) {
//       let errorMessage =
//         "Registration failed.";

//       if (error?.response?.data) {
//         if (
//           typeof error.response.data ===
//           "string"
//         ) {
//           errorMessage =
//             error.response.data;
//         } else {
//           errorMessage =
//             error.response.data.message ||
//             error.response.data.error ||
//             errorMessage;
//         }
//       }

//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// const initialState = {
//   user: parsedUser,
//   token: storedToken || null,
//   isAuthenticated: !!storedToken,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",

//   initialState,

//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.loading = false;
//       state.error = null;

//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       delete axios.defaults.headers.common
//         .Authorization;
//     },

//     clearError: (state) => {
//       state.error = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(
//         login.pending,
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )

//       .addCase(
//         login.fulfilled,
//         (state, action) => {
//           state.loading = false;

//           /*
//            * Keep the COMPLETE payload as user.
//            *
//            * Example test payload:
//            * {
//            *   token: "new-jwt",
//            *   role: "ADMIN",
//            *   user: { username: "admin" }
//            * }
//            *
//            * The test expects:
//            * state.auth.user.role === "ADMIN"
//            */
//           state.user = action.payload;

//           state.token =
//             action.payload?.token || null;

//           state.isAuthenticated =
//             !!action.payload?.token;

//           state.error = null;

//           if (action.payload?.token) {
//             localStorage.setItem(
//               "token",
//               action.payload.token
//             );
//           }

//           localStorage.setItem(
//             "user",
//             JSON.stringify(action.payload)
//           );

//           if (action.payload?.token) {
//             axios.defaults.headers.common.Authorization =
//               `Bearer ${action.payload.token}`;
//           }
//         }
//       )

//       .addCase(
//         login.rejected,
//         (state, action) => {
//           state.loading = false;
//           state.error =
//             action.payload ||
//             action.error?.message ||
//             "Login failed.";
//           state.isAuthenticated = false;
//         }
//       )

//       .addCase(
//         register.pending,
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )

//       .addCase(
//         register.fulfilled,
//         (state) => {
//           state.loading = false;
//           state.error = null;
//         }
//       )

//       .addCase(
//         register.rejected,
//         (state, action) => {
//           state.loading = false;
//           state.error =
//             action.payload ||
//             action.error?.message ||
//             "Registration failed.";
//         }
//       );
//   },
// });

// export const {
//   logout,
//   clearError,
// } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// =========================
// LOGIN
// =========================
export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/login`,
                {
                    username,
                    password,
                }
            );

            const data = response.data;

            // Store token
            if (data.token) {
                localStorage.setItem("token", data.token);

                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${data.token}`;
            }

            // Store user
            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            } else if (data.username || data.role) {
                const user = {
                    username: data.username,
                    role: data.role,
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }

            return data;

        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Login failed";

            return rejectWithValue(errorMsg);
        }
    }
);


// =========================
// REGISTER
// =========================
export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/register`,
                userData
            );

            return response.data;

        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Registration failed";

            return rejectWithValue(errorMsg);
        }
    }
);


// =========================
// INITIAL STATE
// =========================
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState = {
    user: storedUser
        ? JSON.parse(storedUser)
        : null,

    token: storedToken || null,

    isAuthenticated: !!storedToken,

    loading: false,

    error: null,
};


// =========================
// SLICE
// =========================
const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        logout: (state) => {

            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            delete axios.defaults.headers.common["Authorization"];
        },

        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        // =========================
        // LOGIN
        // =========================

        builder

            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(login.fulfilled, (state, action) => {

    state.loading = false;
    state.error = null;

    state.token = action.payload.token;

    state.user = {
        ...(action.payload.user || {}),
        username:
            action.payload.user?.username ||
            action.payload.username,
        role:
            action.payload.role ||
            action.payload.user?.role,
    };

    state.isAuthenticated = true;
})

            .addCase(login.rejected, (state, action) => {

                state.loading = false;

                state.error =
                    action.payload || "Login failed";

                state.isAuthenticated = false;
            });


        // =========================
        // REGISTER
        // =========================

        builder

            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })

            .addCase(register.rejected, (state, action) => {

                state.loading = false;

                state.error =
                    action.payload || "Registration failed";
            });
    },
});


export const {
    logout,
    clearError,
} = authSlice.actions;


export default authSlice.reducer;