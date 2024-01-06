import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  map: null,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addMap: (state, action) => {
      state.map = action.payload;
    },
  },
});

export const { addMap } = mapSlice.actions;

export default mapSlice.reducer;
