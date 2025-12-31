'use client';

import { useEffect, useState } from 'react';
import { getMonthDays, formatDate } from '../lib/calendar';

type Props = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export default function CalendarMonth({
  selectedDate,
  onSelectDate,
}: Props) {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const todayStr = new Date().toISOString().slice(0, 10);

  // Initialize ONLY on client
  useEffect(() => {
    const d = new Date(selectedDate);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }, [selectedDate]);

  // Prevent mismatched render
  if (year === null || month === null) {
    return null;
  }

  const days = getMonthDays(year, month);

  function goPrevMonth() {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => (y ?? 0) - 1);
        return 11;
      }
      return (m ?? 0) - 1;
    });
  }

  function goNextMonth() {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => (y ?? 0) + 1);
        return 0;
      }
      return (m ?? 0) + 1;
    });
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header-row">
        <button onClick={goPrevMonth}>‹</button>

        <span>
          {new Date(year, month).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </span>

        <button onClick={goNextMonth}>›</button>
      </div>

      <div className="calendar-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
          <div key={d+idx} className="calendar-header">
            {d}
          </div>
        ))}

        {days.map((date, idx) => {
          if (!date) {
            return <div key={idx} className="calendar-cell empty" />;
          }

          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          
          return (
            <button
              key={idx}
              className={`calendar-cell 
                ${isSelected ? 'selected' : ''}
                ${isToday ? 'today' : ''}
                `
              }
              onClick={() => onSelectDate(dateStr)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
