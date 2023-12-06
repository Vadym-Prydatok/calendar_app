import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { TaskType } from "../types/TaskType";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: [] as TaskType[],
  reducers: {
    setTasks: (_state, action) => {
      return action.payload;
    },

    apendTask: (state, action) => {
      state.push(action.payload);
    },

    addNewTask: (state, action) => {
      const { date, title, color } = action.payload;
      if (!title.trim()) {
        return state;
      }

      const task = {
        id: uuidv4(),
        title,
        date,
        labels: color ? [color] : [],
      };

      state.push(task);
    },
    editTask: (state, action) => {
      const { id, title, color } = action.payload;
      if (!title.trim()) {
        const index = state.findIndex((task) => task.id === id);
        if (index !== -1) {
          state.splice(index, 1);
        }
        return;
      }

      const task = state.find((task) => task.id === id);
      if (task) {
        const newLabels =
          task.labels && color && !task.labels.includes(color)
            ? [...task.labels, color]
            : task.labels;

        task.title = title;
        task.labels = newLabels;
      }
    },
    deleteTask: (state, action) => {
      const index = state.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const { addNewTask, editTask, deleteTask, setTasks, apendTask } = tasksSlice.actions;

export default tasksSlice.reducer;
