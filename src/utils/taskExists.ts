import { TaskType } from "../types/TaskType";

export const taskExists = (task: TaskType, tasks: TaskType[]) => {
  return tasks.some((t) => t.id === task.id);
};