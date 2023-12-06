import { createSlice } from "@reduxjs/toolkit";

const colorFilterSlice = createSlice({
  name: 'colorFilter',
  initialState: [] as string[],
  reducers: {
    setColorFilter: (state, action) => {
      if (action.payload === 'null') {
        return [];
      }

      if (state.includes(action.payload)) {
        return state.filter((color) => color !== action.payload);
      } else {
        return [...state, action.payload];
      }
    },
  }
})

export const { setColorFilter } = colorFilterSlice.actions;
export default colorFilterSlice.reducer;