'use client';

import { useEffect, useState } from 'react';
import CalendarMonth from './components/CalendarMonth';
import TaskList from './components/TaskList';
import ChatCommandBar from './components/ChatCommandBar';
import { parseAddTaskCommand } from './lib/parseCommand';
import { Task } from './lib/type';
import { loadFromStorage, saveToStorage } from './lib/storage';
import './dashboard.css';

const TASKS_KEY = 'personal-agent-tasks';
const DATE_KEY = 'personal-agent-selected-date';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    loadFromStorage(
      DATE_KEY,
      new Date().toISOString().slice(0, 10)
    )
  );

  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage<Task[]>(TASKS_KEY, [])
  );

  /* ---- Persist tasks ---- */
  useEffect(() => {
    saveToStorage(TASKS_KEY, tasks);
  }, [tasks]);

  /* ---- Persist selected date ---- */
  useEffect(() => {
    saveToStorage(DATE_KEY, selectedDate);
  }, [selectedDate]);

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  }

  function handleCommand(input: string) {
    const result = parseAddTaskCommand(input, selectedDate);
    if (!result) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      done: false,
      ...result,
    };

    setTasks((prev) => [...prev, newTask]);
  }

  return (
    <div className="dashboard-grid">
      <div className="calendar">
        <CalendarMonth
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      <div className="reserved">Reserved</div>

      <div className="tasks">
        <TaskList
          tasks={tasks}
          selectedDate={selectedDate}
          onToggleTask={toggleTask}
        />
      </div>

      <div className="work-area">Work Area / Notes</div>

      <div className="chat">
        <ChatCommandBar onCommand={handleCommand} />
      </div>
    </div>
  );
}
