/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';


type TAuthState = {
  user: null | any;
  access_token: null | string;
};

const initialState: TAuthState = {
  user: null,
  access_token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.access_token = access_token;
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.access_token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
