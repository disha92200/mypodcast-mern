import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  user: null,
  otp: {
    phone: "",
    hash: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
    if(!state.user){
      state.isAuth = false;
    }
    else{
      state.isAuth = true;
    }
    },
    setOtp: (state, action) => {
      const { phone, hash } = action.payload;
      state.otp.hash = hash;
      state.otp.phone = phone;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;
