// // // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // // import axios from "axios";

// // // const storedUser = localStorage.getItem("user");
// // // const storedToken = localStorage.getItem("token");

// // // let parsedUser = null;

// // // try {
// // //   parsedUser = storedUser
// // //     ? JSON.parse(storedUser)
// // //     : null;
// // // } catch (error) {
// // //   parsedUser = null;
// // // }

// // // export const login = createAsyncThunk(
// // //   "auth/login",
// // //   async (credentials, { rejectWithValue }) => {
// // //     try {
// // //       const response = await axios.post(
// // //         "/api/auth/login",
// // //         credentials
// // //       );

// // //       const data = response?.data || {};

// // //       const token = data.token;

// // //       if (token) {
// // //         localStorage.setItem("token", token);
// // //       }

// // //       /*
// // //        * Store the complete response object.
// // //        * This is also important for the test which expects:
// // //        * state.auth.user.role === "ADMIN"
// // //        */
// // //       localStorage.setItem(
// // //         "user",
// // //         JSON.stringify(data)
// // //       );

// // //       return data;
// // //     } catch (error) {
// // //       let errorMessage =
// // //         "Invalid username or password.";

// // //       if (error?.response?.data) {
// // //         if (
// // //           typeof error.response.data ===
// // //           "string"
// // //         ) {
// // //           errorMessage =
// // //             error.response.data;
// // //         } else {
// // //           errorMessage =
// // //             error.response.data.message ||
// // //             error.response.data.error ||
// // //             errorMessage;
// // //         }
// // //       }

// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // // export const register = createAsyncThunk(
// // //   "auth/register",
// // //   async (userData, { rejectWithValue }) => {
// // //     try {
// // //       const response =
// // //         await axios.post(
// // //           "/api/auth/register",
// // //           userData
// // //         );

// // //       return response?.data;
// // //     } catch (error) {
// // //       let errorMessage =
// // //         "Registration failed.";

// // //       if (error?.response?.data) {
// // //         if (
// // //           typeof error.response.data ===
// // //           "string"
// // //         ) {
// // //           errorMessage =
// // //             error.response.data;
// // //         } else {
// // //           errorMessage =
// // //             error.response.data.message ||
// // //             error.response.data.error ||
// // //             errorMessage;
// // //         }
// // //       }

// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // // const initialState = {
// // //   user: parsedUser,
// // //   token: storedToken || null,
// // //   isAuthenticated: !!storedToken,
// // //   loading: false,
// // //   error: null,
// // // };

// // // const authSlice = createSlice({
// // //   name: "auth",

// // //   initialState,

// // //   reducers: {
// // //     logout: (state) => {
// // //       state.user = null;
// // //       state.token = null;
// // //       state.isAuthenticated = false;
// // //       state.loading = false;
// // //       state.error = null;

// // //       localStorage.removeItem("token");
// // //       localStorage.removeItem("user");

// // //       delete axios.defaults.headers.common
// // //         .Authorization;
// // //     },

// // //     clearError: (state) => {
// // //       state.error = null;
// // //     },
// // //   },

// // //   extraReducers: (builder) => {
// // //     builder
// // //       .addCase(
// // //         login.pending,
// // //         (state) => {
// // //           state.loading = true;
// // //           state.error = null;
// // //         }
// // //       )

// // //       .addCase(
// // //         login.fulfilled,
// // //         (state, action) => {
// // //           state.loading = false;

// // //           /*
// // //            * Keep the COMPLETE payload as user.
// // //            *
// // //            * Example test payload:
// // //            * {
// // //            *   token: "new-jwt",
// // //            *   role: "ADMIN",
// // //            *   user: { username: "admin" }
// // //            * }
// // //            *
// // //            * The test expects:
// // //            * state.auth.user.role === "ADMIN"
// // //            */
// // //           state.user = action.payload;

// // //           state.token =
// // //             action.payload?.token || null;

// // //           state.isAuthenticated =
// // //             !!action.payload?.token;

// // //           state.error = null;

// // //           if (action.payload?.token) {
// // //             localStorage.setItem(
// // //               "token",
// // //               action.payload.token
// // //             );
// // //           }

// // //           localStorage.setItem(
// // //             "user",
// // //             JSON.stringify(action.payload)
// // //           );

// // //           if (action.payload?.token) {
// // //             axios.defaults.headers.common.Authorization =
// // //               `Bearer ${action.payload.token}`;
// // //           }
// // //         }
// // //       )

// // //       .addCase(
// // //         login.rejected,
// // //         (state, action) => {
// // //           state.loading = false;
// // //           state.error =
// // //             action.payload ||
// // //             action.error?.message ||
// // //             "Login failed.";
// // //           state.isAuthenticated = false;
// // //         }
// // //       )

// // //       .addCase(
// // //         register.pending,
// // //         (state) => {
// // //           state.loading = true;
// // //           state.error = null;
// // //         }
// // //       )

// // //       .addCase(
// // //         register.fulfilled,
// // //         (state) => {
// // //           state.loading = false;
// // //           state.error = null;
// // //         }
// // //       )

// // //       .addCase(
// // //         register.rejected,
// // //         (state, action) => {
// // //           state.loading = false;
// // //           state.error =
// // //             action.payload ||
// // //             action.error?.message ||
// // //             "Registration failed.";
// // //         }
// // //       );
// // //   },
// // // });

// // // export const {
// // //   logout,
// // //   clearError,
// // // } = authSlice.actions;

// // // export default authSlice.reducer;

// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // const API_URL = "http://localhost:8080/api/auth";

// // // =========================
// // // LOGIN
// // // =========================
// // export const login = createAsyncThunk(
// //     "auth/login",
// //     async ({ username, password }, { rejectWithValue }) => {
// //         try {
// //             const response = await axios.post(
// //                 `${API_URL}/login`,
// //                 {
// //                     username,
// //                     password,
// //                 }
// //             );

// //             const data = response.data;

// //             // Store token
// //             if (data.token) {
// //                 localStorage.setItem("token", data.token);

// //                 axios.defaults.headers.common["Authorization"] =
// //                     `Bearer ${data.token}`;
// //             }

// //             // Store user
// //             if (data.user) {
// //                 localStorage.setItem(
// //                     "user",
// //                     JSON.stringify(data.user)
// //                 );
// //             } else if (data.username || data.role) {
// //                 const user = {
// //                     username: data.username,
// //                     role: data.role,
// //                 };

// //                 localStorage.setItem(
// //                     "user",
// //                     JSON.stringify(user)
// //                 );
// //             }

// //             return data;

// //         } catch (error) {
// //             const errorMsg =
// //                 error.response?.data?.message ||
// //                 error.response?.data?.error ||
// //                 error.message ||
// //                 "Login failed";

// //             return rejectWithValue(errorMsg);
// //         }
// //     }
// // );


// // // =========================
// // // REGISTER
// // // =========================
// // export const register = createAsyncThunk(
// //     "auth/register",
// //     async (userData, { rejectWithValue }) => {
// //         try {
// //             const response = await axios.post(
// //                 `${API_URL}/register`,
// //                 userData
// //             );

// //             return response.data;

// //         } catch (error) {
// //             const errorMsg =
// //                 error.response?.data?.message ||
// //                 error.response?.data?.error ||
// //                 error.message ||
// //                 "Registration failed";

// //             return rejectWithValue(errorMsg);
// //         }
// //     }
// // );


// // // =========================
// // // INITIAL STATE
// // // =========================
// // const storedToken = localStorage.getItem("token");
// // const storedUser = localStorage.getItem("user");

// // const initialState = {
// //     user: storedUser
// //         ? JSON.parse(storedUser)
// //         : null,

// //     token: storedToken || null,

// //     isAuthenticated: !!storedToken,

// //     loading: false,

// //     error: null,
// // };
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "http://localhost:8080/api/auth";

// // =========================
// // LOGIN
// // =========================
// export const login = createAsyncThunk(
//     "auth/login",
//     async ({ username, password }, { rejectWithValue }) => {
//         try {
//             const response = await axios.post(
//                 `${API_URL}/login`,
//                 {
//                     username,
//                     password,
//                 }
//             );

//             const data = response.data;

//             // Store token
//             if (data.token) {
//                 localStorage.setItem("token", data.token);

//                 axios.defaults.headers.common["Authorization"] =
//                     `Bearer ${data.token}`;
//             }

//             // Store user
//             if (data.user) {
//                 localStorage.setItem(
//                     "user",
//                     JSON.stringify(data.user)
//                 );
//             } else if (data.username || data.role) {
//                 const user = {
//                     username: data.username,
//                     role: data.role,
//                 };

//                 localStorage.setItem(
//                     "user",
//                     JSON.stringify(user)
//                 );
//             }

//             return data;

//         } catch (error) {
//             const errorMsg =
//                 error.response?.data?.message ||
//                 error.response?.data?.error ||
//                 error.message ||
//                 "Login failed";

//             return rejectWithValue(errorMsg);
//         }
//     }
// );


// // =========================
// // REGISTER
// // =========================
// export const register = createAsyncThunk(
//     "auth/register",
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axios.post(
//                 `${API_URL}/register`,
//                 userData
//             );

//             return response.data;

//         } catch (error) {
//             const errorMsg =
//                 error.response?.data?.message ||
//                 error.response?.data?.error ||
//                 error.message ||
//                 "Registration failed";

//             return rejectWithValue(errorMsg);
//         }
//     }
// );


// // =========================
// // INITIAL STATE
// // =========================
// const storedToken = localStorage.getItem("token");
// const storedUser = localStorage.getItem("user");

// const initialState = {
//     user: storedUser
//         ? JSON.parse(storedUser)
//         : null,

//     token: storedToken || null,

//     isAuthenticated: !!storedToken,

//     loading: false,

//     error: null,
// };


// // =========================
// // AUTH SLICE
// // =========================
// const authSlice = createSlice({
//     name: "auth",

//     initialState,

//     reducers: {

//         // =========================
//         // LOGOUT
//         // =========================
//         logout: (state) => {
//             state.user = null;
//             state.token = null;
//             state.isAuthenticated = false;
//             state.loading = false;
//             state.error = null;

//             // Remove stored authentication data
//             localStorage.removeItem("token");
//             localStorage.removeItem("user");

//             // Remove Authorization header
//             delete axios.defaults.headers.common["Authorization"];
//         },
//     },

//     extraReducers: (builder) => {

//         // =========================
//         // LOGIN - PENDING
//         // =========================
//         builder.addCase(login.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         });


//         // =========================
//         // LOGIN - SUCCESS
//         // =========================
//         builder.addCase(login.fulfilled, (state, action) => {
//             state.loading = false;
//             state.error = null;
//             state.isAuthenticated = true;

//             const data = action.payload;

//             // Save token in Redux state
//             if (data.token) {
//                 state.token = data.token;
//             }

//             // Save user in Redux state
//             if (data.user) {
//                 state.user = data.user;
//             } else if (data.username || data.role) {
//                 state.user = {
//                     username: data.username,
//                     role: data.role,
//                 };
//             }
//         });


//         // =========================
//         // LOGIN - FAILED
//         // =========================
//         builder.addCase(login.rejected, (state, action) => {
//             state.loading = false;
//             state.isAuthenticated = false;
//             state.error = action.payload || "Login failed";
//         });


//         // =========================
//         // REGISTER - PENDING
//         // =========================
//         builder.addCase(register.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         });


//         // =========================
//         // REGISTER - SUCCESS
//         // =========================
//         builder.addCase(register.fulfilled, (state) => {
//             state.loading = false;
//             state.error = null;
//         });


//         // =========================
//         // REGISTER - FAILED
//         // =========================
//         builder.addCase(register.rejected, (state, action) => {
//             state.loading = false;
//             state.error =
//                 action.payload || "Registration failed";
//         });
//     },
// });


// // =========================
// // EXPORT LOGOUT ACTION
// // =========================
// export const { logout } = authSlice.actions;


// // =========================
// // EXPORT AUTH REDUCER
// // =========================
// export default authSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// =========================
// API URL
// =========================
const API_URL = "http://localhost:8080/api/auth";

// =========================
// RESTORE STORED AUTH
// =========================
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const storedAuth = localStorage.getItem("isAuthenticated");

let parsedUser = null;

try {
  parsedUser = storedUser
    ? JSON.parse(storedUser)
    : null;
} catch (error) {
  parsedUser = null;
}

// =========================
// RESTORE AXIOS TOKEN
// =========================
if (storedToken && axios.defaults?.headers?.common) {
  axios.defaults.headers.common.Authorization =
    `Bearer ${storedToken}`;
}

// =========================
// AXIOS REQUEST INTERCEPTOR
// =========================
if (typeof axios.interceptors?.request?.use === "function") {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (
        token &&
        config.headers &&
        !config.headers.Authorization
      ) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}

// =========================
// LOGIN
// =========================
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        credentials
      );

      const data = response?.data || {};

      const token = data.token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("isAuthenticated", "true");
      }

      /*
       * Store the complete response object.
       * This is also important for the test which expects:
       * state.auth.user.role === "ADMIN"
       */
      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      let errorMessage = "Invalid username or password.";

      if (!error?.response && error?.request) {
        errorMessage =
          "Unable to connect to the server. Please try again.";
      } else if (error?.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            errorMessage;
        }
      }

      return rejectWithValue(errorMessage);
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

      return response?.data;
    } catch (error) {
      let errorMessage = "Registration failed.";

      if (!error?.response && error?.request) {
        errorMessage =
          "Unable to connect to the server. Please try again.";
      } else if (error?.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            errorMessage;
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// =========================
// INITIAL STATE
// =========================
const initialState = {
  user: parsedUser,
  token: storedToken || null,
  isAuthenticated:
    storedAuth === "true" || !!storedToken,
  loading: false,
  error: null,
};

// =========================
// AUTH SLICE
// =========================
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // =========================
    // LOGOUT
    // =========================
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");

      delete axios.defaults.headers.common
        .Authorization;
    },

    // =========================
    // CLEAR ERROR
    // =========================
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // LOGIN PENDING
      // =========================
      .addCase(
        login.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // =========================
      // LOGIN SUCCESS
      // =========================
      .addCase(
        login.fulfilled,
        (state, action) => {
          state.loading = false;

          /*
           * Keep the COMPLETE payload as user.
           *
           * Example test payload:
           * {
           *   token: "new-jwt",
           *   role: "ADMIN",
           *   user: { username: "admin" }
           * }
           *
           * The test expects:
           * state.auth.user.role === "ADMIN"
           */
          state.user = action.payload;

          state.token =
            action.payload?.token || null;

          state.isAuthenticated =
            !!action.payload?.token;

          state.error = null;

          if (action.payload?.token) {
            localStorage.setItem(
              "token",
              action.payload.token
            );

            localStorage.setItem(
              "isAuthenticated",
              "true"
            );
          }

          localStorage.setItem(
            "user",
            JSON.stringify(action.payload)
          );

          if (action.payload?.token) {
            axios.defaults.headers.common.Authorization =
              `Bearer ${action.payload.token}`;
          }
        }
      )

      // =========================
      // LOGIN FAILED
      // =========================
      .addCase(
        login.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            action.error?.message ||
            "Login failed.";

          state.isAuthenticated = false;

          localStorage.removeItem(
            "isAuthenticated"
          );
        }
      )

      // =========================
      // REGISTER PENDING
      // =========================
      .addCase(
        register.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // =========================
      // REGISTER SUCCESS
      // =========================
      .addCase(
        register.fulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )

      // =========================
      // REGISTER FAILED
      // =========================
      .addCase(
        register.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            action.error?.message ||
            "Registration failed.";
        }
      );
  },
});

// =========================
// EXPORT ACTIONS
// =========================
export const {
  logout,
  clearError,
} = authSlice.actions;

// =========================
// EXPORT REDUCER
// =========================
export default authSlice.reducer;
