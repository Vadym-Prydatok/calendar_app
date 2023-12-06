import styled from "styled-components";
import { DayType } from "../types/DayType";
import { TaskType } from "../types/TaskType";
import { ColorPicker } from "./ColorPicker";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { deleteTask, setTasks } from "../features/tasksSlice";
import { useRef } from "react";

const Day = styled.div<{ $color?: string }>`
  padding: 10px;
  overflow-x: auto;
  font-size: 14px;
  border: 1px solid #ccc;
  background: ${(props) => props.color || "transparent"};

  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

const ButtonDeleteTask = styled.button`
  position: absolute;
  text-align: center;
  padding: 0;
  width: 14px;
  height: 14px;
  font-size: 9px;
  right: 2px;
  border-radius: 50%;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  opacity: 0;

  &:hover {
    background-color: #999;
  }
`;

const TaskCard = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  position: relative;
  background-color: white;
  border: 1px solid #ccc;
  padding: 4px 20px 4px 4px;
  border-radius: 2px;
  word-wrap: break-word;

  &:hover {
    ${ButtonDeleteTask} {
      opacity: 1;
    }
  }
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 4px;
`;

const Label = styled.span<{ $color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 12px;
  font-size: 10px;
  background-color: ${(props) => props.$color};
  border-radius: 2px;
  color: transparent;

  &:hover {
    color: #fff;
  }
`;

const Holiday = styled.span`
  padding-left: 10px;
  font-size: 12px;
  font-weight: bold;
  color: #ff1500;
`;

interface DayComponentProps {
  day: DayType;
  isEditing: boolean;
  selectedTask: TaskType | null;
  selectedDay: string;
  taskTitle: string;
  handleSelectDay: (e: React.MouseEvent, date: string) => void;
  renameTask: (date: string, task: TaskType) => void;
  handleDeleteLabel: (id: string, label: string) => void;
  setTaskTitle: (value: string) => void;
}

export const DayComponent: React.FC<DayComponentProps> = ({
  day,
  isEditing,
  selectedTask,
  taskTitle,
  selectedDay,
  handleSelectDay,
  renameTask,
  handleDeleteLabel,
  setTaskTitle,
}) => {
  const tasks = useAppSelector((state) => state.tasks);
  const inputElement = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    task: TaskType
  ) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    e.preventDefault();

    target.style.background = "#00d3c8";
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    target.style.background = "";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    target.style.background = "";
  };

  const handleDropTask = (
    e: React.DragEvent<HTMLDivElement>,
    targetTask: TaskType
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLDivElement;
    const taskId = e.dataTransfer.getData("taskId");
    const sourceTask = tasks.find((task) => task.id === taskId);

    if (sourceTask) {
      const updatedTasks = [...tasks];
      const sourceIndex = updatedTasks.findIndex(
        (task) => task.id === sourceTask.id
      );
      const targetIndex = updatedTasks.findIndex(
        (task) => task.id === targetTask.id
      );

      if (sourceIndex !== -1 && targetIndex !== -1) {
        updatedTasks.splice(sourceIndex, 1);
        updatedTasks.splice(targetIndex, 0, sourceTask);

        dispatch(setTasks(updatedTasks));
      }
    }

    target.style.background = "";
  };

  const handleDropDay = (
    e: React.DragEvent<HTMLDivElement>,
    targetDay: DayType
  ) => {
    e.preventDefault();

    const target = e.target as HTMLDivElement;
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((task) => task.id === taskId);

    if (task) {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, date: targetDay.date } : task
      );

      dispatch(setTasks(updatedTasks));
    }

    target.style.background = "";
  };

  return (
    <Day
      key={day.date}
      onDoubleClick={(e) => handleSelectDay(e, day.date)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDropDay(e, day)}
      onDragLeave={(e) => handleDragLeave(e)}
      color={day.name === "currentMonth" ? "#d7f0ec" : "#f3faf8"}
    >
      {day.holiday ? <b>{day.day}</b> : <span>{day.day}</span>}
      {day.holiday && <Holiday>{day.holiday}</Holiday>}
      {day.tasks && (
        <>
          {day.tasks.map((task) =>
            isEditing && task.id === selectedTask?.id ? (
              <TaskCard
                key={task.id + "editing"}
                onDoubleClick={() => renameTask(day.date, task)}
              >
                <input
                  style={{ maxWidth: "135px" }}
                  ref={inputElement}
                  placeholder="Delete task"
                  type="text"
                  autoFocus
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />

                <ColorPicker />
              </TaskCard>
            ) : (
              <TaskCard
                key={task.id}
                onDoubleClick={() => renameTask(day.date, task)}
                onDragStart={(e) => handleDragStart(e, task)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDragEnd={(e) => handleDragEnd(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDropTask(e, task)}
                draggable
              >
                {task.labels && (
                  <LabelWrapper
                    onDragStart={(e) => e.stopPropagation()}
                    onDragOver={(e) => e.stopPropagation()}
                    onDrop={(e) => e.stopPropagation()}
                  >
                    {task.labels.map((label) => (
                      <Label
                        key={label}
                        $color={label}
                        onClick={() => handleDeleteLabel(task.id, label)}
                      >
                        Delete
                      </Label>
                    ))}
                  </LabelWrapper>
                )}

                {task.title}

                <ButtonDeleteTask onClick={() => dispatch(deleteTask(task.id))}>
                  X
                </ButtonDeleteTask>
              </TaskCard>
            )
          )}
        </>
      )}

      {selectedDay === day.date && !isEditing && (
        <div style={{ position: "absolute" }}>
          <input
            style={{ maxWidth: "140px" }}
            ref={inputElement}
            placeholder="Add task"
            type="text"
            autoFocus
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <ColorPicker />
        </div>
      )}
    </Day>
  );
};
