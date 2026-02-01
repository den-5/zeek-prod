import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  isLoggedIn: false,
  balance: 0, // Add balance to the initial state
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { setEmail, setIsLoggedIn, setBalance, setUsername } =
  userSlice.actions;
export default userSlice.reducer;
