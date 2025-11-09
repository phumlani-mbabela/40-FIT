
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  email: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action){ state.token = action.payload; },
    setEmail(state, action){ state.email = action.payload; },
    setUser(state, action){ state.user = action.payload; },
    clearAuth(state){ state.token = null; state.email = null; state.user = null; },
  }
});

export const { setToken, setEmail, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
