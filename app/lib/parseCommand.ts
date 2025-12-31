import { Task } from './types';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function parseAddTaskCommand(
  input: string,
  selectedDate: string
): Omit<Task, 'id' | 'done'> | null {
  const text = input.trim().toLowerCase();

  if (!text.startsWith('add ')) return null;

  let title = input.slice(4); // keep original casing
  let date = selectedDate;
  let category = 'General';

  // Date parsing
  if (text.includes(' today')) {
    date = todayStr();
    title = title.replace(/ today/i, '');
  } else if (text.includes(' tomorrow')) {
    date = tomorrowStr();
    title = title.replace(/ tomorrow/i, '');
  } else {
    const dateMatch = text.match(/ on (\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      date = dateMatch[1];
      title = title.replace(/ on \d{4}-\d{2}-\d{2}/i, '');
    }
  }

  // Category parsing
  const categoryMatch = text.match(/ under (.+)$/);
  if (categoryMatch) {
    category = categoryMatch[1].trim();
    title = title.replace(/ under .+$/i, '');
  }

  title = title.trim();

  if (!title) return null;

  return {
    title,
    date,
    category,
  };
}
