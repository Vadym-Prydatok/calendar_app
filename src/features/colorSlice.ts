import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const colorSlice = createSlice({
  name: 'color',
  initialState: null as string | null,
  reducers: {
    setColor: (_state, action: PayloadAction<string | null>) => {
      return action.payload;
    }
  }
});

export const { setColor } = colorSlice.actions;
export default colorSlice.reducer;