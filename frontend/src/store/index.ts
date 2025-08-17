import { configureStore, createSlice } from "@reduxjs/toolkit";
import { removeToken, setToken } from "../utils/token";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    avatar: "",
  },
  reducers: {
    login(state, action) {
      state.username = action.payload.username;
      state.avatar = action.payload.avatar || "";
      setToken(action.payload.token);
    },
    setUser(state, action) {
      state.username = action.payload.username || "";
      state.avatar = action.payload.avatar || "";
    },
    logout(state) {
      state.username = "";
      state.avatar = "";
      removeToken();
    },
  },
});

export const { login, logout, setUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;

// Redux store configuration
