import { Task } from './types';

/* ---------------- Utilities ---------------- */

function todayStr() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles',}).slice(0, 10)
}

function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/* ---------------- Command Result Types ---------------- */

export type CommandResult =
  | { type: 'add'; task: Omit<Task, 'id' | 'done'> }
  | { type: 'delete'; title: string }
  | { type: 'change'; from: string; to: string }
  | null;

/* ---------------- Main Parser ---------------- */


export function parseCommand(
  input: string,
  selectedDate: string
): CommandResult {
  let result = parseCommand1(input, selectedDate);
  return result;
}
function parseCommand1(
  input: string,
  selectedDate: string
): CommandResult {
  const text = input.trim();

  if (!text) return null;

  /* ---------- ADD ---------- */
  if (text.toLowerCase().startsWith('add ')) {
    let title = text.slice(4).trim();
    let date = selectedDate;
    let category = 'General';

    // date keywords
    if (/ today$/i.test(title)) {
      date = todayStr();
      title = title.replace(/ today$/i, '');
    } else if (/ tomorrow$/i.test(title)) {
      date = tomorrowStr();
      title = title.replace(/ tomorrow$/i, '');
    } else {
      const dateMatch = title.match(
        / on (\d{4}-\d{2}-\d{2})$/i
      );
      if (dateMatch) {
        date = dateMatch[1];
        title = title.replace(
          / on \d{4}-\d{2}-\d{2}$/i,
          ''
        );
      }
    }

    // category
    const categoryMatch = title.match(/ under (.+)$/i);
    if (categoryMatch) {
      category = categoryMatch[1].trim();
      title = title.replace(/ under .+$/i, '');
    }

    title = title.trim();
    if (!title) return null;

    return {
      type: 'add',
      task: {
        title,
        date,
        category,
      },
    };
  }

  /* ---------- DELETE ---------- */
  const deleteMatch = text.match(
    /^(delete|remove)( task)? (.+)$/i
  );
  if (deleteMatch) {
    return {
      type: 'delete',
      title: deleteMatch[3].trim(),
    };
  }

  /* ---------- CHANGE ---------- */
  const changeMatch = text.match(
    /^change (.+) to (.+)$/i
  );
  if (changeMatch) {
    return {
      type: 'change',
      from: changeMatch[1].trim(),
      to: changeMatch[2].trim(),
    };
  }

  return null;
}
