import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json(
      { error: 'date is required' },
      { status: 400 }
    );
  }

  const tasks = db
    .prepare(
      'SELECT * FROM tasks WHERE date = ? ORDER BY category, title'
    )
    .all(date)
    .map((t) => ({
      ...t,
      done: Boolean(t.done),
    }));

  return NextResponse.json(tasks);
}

import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const { action, date } = body;

  if (!action) {
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    );
  }

  if (!action.date) {
    action.date = date;
  }

  /* ---------- ADD ---------- */
  if (action.type === 'add') {
    const id = randomUUID();

    db.prepare(
      `INSERT INTO tasks (id, title, date, category, done)
       VALUES (?, ?, ?, ?, ?)`
    ).run(
      id,
      action.task.title,
      action.task.date,
      action.task.category,
      0
    );

    return NextResponse.json({ success: true });
  }

  /* ---------- DELETE ---------- */
  if (action.type === 'delete') {
    db.prepare(
      `DELETE FROM tasks
       WHERE date = ? AND LOWER(title) = LOWER(?)`
    ).run(action.date, action.title);

    return NextResponse.json({ success: true });
  }

  /* ---------- CHANGE ---------- */
  if (action.type === 'change') {
    db.prepare(
      `UPDATE tasks
       SET title = ?
       WHERE date = ? AND LOWER(title) = LOWER(?)`
    ).run(action.to, action.date, action.from);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: 'Unknown action' },
    { status: 400 }
  );
}
