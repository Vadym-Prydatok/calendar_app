import { configureStore } from "@reduxjs/toolkit";
import colorFilterReducer from "../features/colorFilterSlice";
import colorReducer from "../features/colorSlice";
import tasksReducer from "../features/tasksSlice";


export const store = configureStore({
  reducer: {
    colorFilter: colorFilterReducer,
    color: colorReducer,
    tasks: tasksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;