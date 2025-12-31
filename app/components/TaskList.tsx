'use client';

import { Task } from '../lib/types';

type Props = {
  tasks: Task[];
  selectedDate: string;
  onToggleTask: (id: string) => void;
};

export default function TaskList({
  tasks,
  selectedDate,
  onToggleTask,
}: Props) {
  const tasksForDay = tasks.filter(
    (task) => task.date === selectedDate
  );

  const grouped = tasksForDay.reduce<Record<string, Task[]>>(
    (acc, task) => {
      acc[task.category] = acc[task.category] || [];
      acc[task.category].push(task);
      return acc;
    },
    {}
  );

  if (tasksForDay.length === 0) {
    return <p>No tasks for this day.</p>;
  }

  return (
    <div>
      <h3>Tasks</h3>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="task-group">
          <h4>{category}</h4>

          {items.map((task) => (
            <label key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggleTask(task.id)}
              />
              <span className={task.done ? 'done' : ''}>
                {task.title}
              </span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
