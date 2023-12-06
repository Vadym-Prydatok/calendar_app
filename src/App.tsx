import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import { getHolidays } from "./api/fetchData";
import { DayType } from "./types/DayType";
import { TaskType } from "./types/TaskType";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { formatDate } from "./utils/formatDate";
import { exportToJson } from "./utils/exportToJson";
import { namesOfDays } from "./data/namesOfDays";
import { HolidayType } from "./types/HolidayType";
import { DayComponent } from "./components/DayComponent";
import {
  addNewTask,
  apendTask,
  editTask,
  setTasks,
} from "./features/tasksSlice";
import { taskExists } from "./utils/taskExists";
import { HeaderComponent } from "./components/HeaderComponent";

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 30px;
  grid-auto-rows: 1fr;
  gap: 4px;
  width: 100%;
`;

const NameOfDay = styled.div<{ $color?: string; $fontcolor: string }>`
  padding: 4px 10px;
  font-size: 14px;
  font-weight: bold;
  max-height: 30px;
  border: 1px solid #ccc;
  background: ${(props) => props.$color || "transparent"};
  color: ${(props) => props.$fontcolor || "inherit"};

  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<HolidayType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [calendarData, setCalendarData] = useState<DayType[]>([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchText, setSearchText] = useState("");

  const headerRef = React.useRef<HTMLHeadElement>(null);

  const colorsFilter = useAppSelector((state) => state.colorFilter);
  const color = useAppSelector((state) => state.color);
  const tasks = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const daysArray = useMemo(
    () => Array.from({ length: daysInMonth }, (_, index) => index + 1),
    [daysInMonth]
  );

  const daysArrayPrevMonth = useMemo(
    () => Array.from({ length: daysInPrevMonth }, (_, index) => index + 1),
    [daysInPrevMonth]
  );

  useEffect(() => {
    getHolidays(currentYear)
      .then((data) => setHolidays(data))
      .catch((error) => {
        console.error(error.message);
        throw new Error("Error fetching holidays");
      });
  }, [currentYear]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [headerRef]);

  const setPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  const setNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };

  const handleSelectDay = (e: React.MouseEvent, date: string) => {
    if ((e.target as HTMLElement) !== (e.currentTarget as HTMLElement)) {
      e.stopPropagation();
      return;
    }

    setSelectedDay(date);
    setIsEditing(false);
  };

  const renameTask = (date: string, task: TaskType) => {
    setSelectedDay(date);
    setIsEditing(true);
    setTaskTitle(task.title);
    setSelectedTask(task);
  };

  const resetSelection = () => {
    setSelectedDay("");
    setTaskTitle("");
  };

  const saveOrCancelChanges = useCallback(
    (event: KeyboardEvent) => {
      if (!selectedDay) {
        return;
      }

      if (event.key === "Escape") {
        resetSelection();
        setIsEditing(false);

        return;
      }

      if (event.key === "Enter" && isEditing) {
        if (!selectedTask) {
          return;
        }
        dispatch(editTask({ id: selectedTask.id, title: taskTitle, color }));
        resetSelection();
        setIsEditing(false);

        return;
      }

      if (event.key === "Enter") {
        dispatch(addNewTask({ date: selectedDay, title: taskTitle, color }));
        resetSelection();
      }
    },
    [isEditing, selectedTask, selectedDay, taskTitle, color]
  );

  const handleDeleteLabel = (id: string, label: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        const newLabels = task.labels!.filter((l) => l !== label);

        return { ...task, labels: newLabels };
      }

      return task;
    });

    dispatch(setTasks(newTasks));
  };

  const createDay = (
    name: string,
    day: number,
    month: number,
    year: number
  ): DayType => {
    const date = formatDate(day, month, year);
    const holiday = holidays.find((holiday) => holiday.date === date);
    const dayTasks = tasks.filter((task) => task.date === date);

    const tasksFiltered = dayTasks.filter((task) => {
      const matchesSearchText = task.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesColorFilter =
        !colorsFilter.length ||
        (task.labels &&
          task.labels.some((label) => colorsFilter.includes(label)));
      return matchesSearchText && matchesColorFilter;
    });

    return {
      name,
      date,
      day,
      holiday: holiday?.name,
      tasks: tasksFiltered.length > 0 ? tasksFiltered : [],
    };
  };

  const renderDays = () => {
    const days: DayType[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      const dayOfPrevMonth =
        daysArrayPrevMonth[daysArrayPrevMonth.length - firstDayOfMonth + i];
      days.push(
        createDay("prevMonth", dayOfPrevMonth, currentMonth - 1, currentYear)
      );
    }

    daysArray.forEach((day) => {
      days.push(createDay("currentMonth", day, currentMonth, currentYear));
    });

    const daysLeft = 7 - (days.length % 7);

    if (daysLeft !== 7) {
      for (let i = 0; i < daysLeft; i++) {
        days.push(createDay("nextMonth", i + 1, currentMonth + 1, currentYear));
      }
    }

    return days;
  };

  useEffect(() => {
    document.addEventListener("keydown", saveOrCancelChanges);

    return () => {
      document.removeEventListener("keydown", saveOrCancelChanges);
    };
  }, [saveOrCancelChanges]);

  useEffect(() => {
    setCalendarData(renderDays());
  }, [
    firstDayOfMonth,
    daysArrayPrevMonth,
    currentMonth,
    currentYear,
    daysArray,
    holidays,
    tasks,
    searchText,
    colorsFilter,
  ]);

  const importFromJson = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || !e.target.result) {
        return;
      }
      const contents = e.target.result as string;
      const data = JSON.parse(contents);
      const newTasks = data
        .filter((day: DayType) => day.tasks)
        .flatMap((day: DayType) => day.tasks);
      const currentData = data.find(
        (day: DayType) => day.name === "currentMonth"
      );
      const currentMonth = currentData.date.split("-")[1];
      const currentYear = currentData.date.split("-")[0];
      setCurrentDate(new Date(currentYear, currentMonth - 1));

      newTasks.forEach((task: TaskType) => {
        if (!taskExists(task, tasks)) {
          dispatch(apendTask(task));
        }
      });
    };
    reader.readAsText(file);
  };

  return (
    <>
      <HeaderComponent
        headerRef={headerRef}
        currentDate={currentDate}
        searchText={searchText}
        setSearchText={setSearchText}
        setPrevMonth={setPrevMonth}
        setNextMonth={setNextMonth}
        exportToJson={() => exportToJson(calendarData)}
        importFromJson={importFromJson}
      />
      <CalendarWrapper
        className="calendar"
        style={{ height: `calc(100vh - ${headerHeight}px)` }}
      >
        {namesOfDays.map((name, i) => (
          <NameOfDay
            key={name}
            $color={i > 0 && i < 6 ? "#e4e6e6" : "#b2b4b4"}
            $fontcolor={i > 0 && i < 6 ? "inherit" : "red"}
          >
            {name}
          </NameOfDay>
        ))}
        {calendarData.map((day) => (
          <DayComponent
            key={day.date}
            day={day}
            isEditing={isEditing}
            selectedTask={selectedTask}
            taskTitle={taskTitle}
            selectedDay={selectedDay}
            handleSelectDay={handleSelectDay}
            renameTask={renameTask}
            handleDeleteLabel={handleDeleteLabel}
            setTaskTitle={setTaskTitle}
          />
        ))}
      </CalendarWrapper>
    </>
  );
};

export default App;
