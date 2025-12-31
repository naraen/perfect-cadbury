'use client';

import { useEffect, useState } from 'react';
import CalendarMonth from './components/CalendarMonth';
import TaskList from './components/TaskList';
import ChatCommandBar from './components/ChatCommandBar';
import { parseCommand } from './lib/parseCommand';
import { Task } from './lib/types';
import { loadFromStorage, saveToStorage } from './lib/storage';
import './dashboard.css';

const TASKS_KEY = 'personal-agent-tasks';
const DATE_KEY = 'personal-agent-selected-date';

export default function DashboardPage() {
  

  /* ---------------- State ---------------- */

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    loadFromStorage(
      DATE_KEY,
      new Date().toISOString().slice(0, 10)
    )
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === 'undefined') return [];
    return loadFromStorage<Task[]>(TASKS_KEY, []);
  });



  /* ---------------- Persistence ---------------- */

  useEffect(() => {
    saveToStorage(TASKS_KEY, tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage(DATE_KEY, selectedDate);
  }, [selectedDate]);

  /* ---------------- Task Actions ---------------- */

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  }

  /* ---------------- Command Handling ---------------- */

  function handleCommand(input: string) {
    const result = parseCommand(input, selectedDate);
    if (!result) return;

    /* ---------- ADD ---------- */
    if (result.type === 'add') {
      console.log(66, result)
      const newTask: Task = {
        id: crypto.randomUUID(),
        done: false,
        ...result.task,
      };

      setTasks((prev) => [...prev, newTask]);
      return;
    }

    /* ---------- DELETE ---------- */
    if (result.type === 'delete') {
      setTasks((prev) => {
        const matches = prev.filter(
          (t) =>
            t.date === selectedDate &&
            t.title.toLowerCase() ===
              result.title.toLowerCase()
        );

        if (matches.length !== 1) return prev;

        return prev.filter((t) => t !== matches[0]);
      });
      return;
    }

    /* ---------- CHANGE ---------- */
    if (result.type === 'change') {
      setTasks((prev) => {
        const matches = prev.filter(
          (t) =>
            t.date === selectedDate &&
            t.title.toLowerCase() ===
              result.from.toLowerCase()
        );

        if (matches.length !== 1) return prev;

        return prev.map((t) =>
          t === matches[0]
            ? { ...t, title: result.to }
            : t
        );
      });
      return;
    }
  }

  /* ---------------- Layout ---------------- */

  return (
    <div className="dashboard-grid">
      {/* Left Top: Calendar */}
      <div className="calendar">
        <CalendarMonth
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* Middle Top: Reserved */}
      <div className="reserved">
        <div className="panel-header">
          <h3>Overview</h3>
          <span className="panel-subtitle">Coming soon</span>
        </div>
      </div>

      {/* Right: Tasks */}
      <div className="tasks">
        <div className="panel-header">
          <h3>Tasks</h3>
          <span className="panel-subtitle1">
            {/*selectedDate*/}
          </span>
      
        </div>

      {mounted && window &&(
        <TaskList
          tasks={tasks}
          selectedDate={selectedDate}
          onToggleTask={toggleTask}
        />
      )}
      </div>

      {/* Middle + Left Center: Work Area */}
      <div className="work-area">
        <div className="panel-header">
          <h3>Notes</h3>
          <span className="panel-subtitle">
            Current focus
          </span>
        </div>

        <p className="empty-state">
          Notes editor coming next…
        </p>
      </div>

      {/* Middle + Left Bottom: Chat */}
      <div className="chat">
        <div className="panel-header">
          <h3>Command</h3>
          <span className="panel-subtitle">
            Add, change, or delete tasks
          </span>
        </div>

        <ChatCommandBar onCommand={handleCommand} />
      </div>
    </div>
  );
}
