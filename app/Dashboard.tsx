'use client';

import { useEffect, useState } from 'react';
import CalendarMonth from './components/CalendarMonth';
import TaskList from './components/TaskList';
import ChatCommandBar from './components/ChatCommandBar';
import { parseCommand } from './lib/parseCommand';
import { Task } from './lib/types';
import './dashboard.css';

export default function Dashboard() {
  /* ---------------- State ---------------- */

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles',}).slice(0, 10)
  );

  const [tasks, setTasks] = useState<Task[]>([]);

  /* ---------------- Fetch Tasks ---------------- */

  async function fetchTasks(date: string) {
    const res = await fetch(`/api/tasks?date=${date}`);
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate]);

  /* ---------------- Task Toggle (UI Only for Now) ---------------- */

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  }

  /* ---------------- Command Handling ---------------- */

  async function handleCommand(input: string) {
    const action = parseCommand(input, selectedDate);
    if (!action) return;

    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        date: selectedDate,
      }),
    });

    // Always re-fetch authoritative state
    fetchTasks(selectedDate);
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
          <span className="panel-subtitle">
            Coming soon
          </span>
        </div>
      </div>

      {/* Right: Tasks */}
      <div className="tasks">
        <div className="panel-header">
          <h3>Tasks</h3>
          <span className="panel-subtitle">
            {selectedDate}
          </span>
        </div>

        <TaskList
          tasks={tasks}
          selectedDate={selectedDate}
          onToggleTask={toggleTask}
        />
      </div>

      {/* Middle + Left Center: Notes */}
      <div className="work-area">
        <div className="panel-header">
          <h3>Notes</h3>
          <span className="panel-subtitle">
            Current focus
          </span>
        </div>

        <p className="empty-state">
          Notes persistence coming next…
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
