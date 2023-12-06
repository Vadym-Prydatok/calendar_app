import { TaskType } from "./TaskType";

export type DayType = {
  date: string;
  name: string;
  day: number;
  holiday?: string;
  tasks?: TaskType[];
}