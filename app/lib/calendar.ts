export function getMonthDays(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const days = [];

  // Padding before month starts (Sun–Sat)
  const startPadding = firstDayOfMonth.getDay();
  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }

  // Actual days
  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}
