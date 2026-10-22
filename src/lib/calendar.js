export const WEEKDAYS = [
  { short: 'dl.', long: 'dilluns' },
  { short: 'dt.', long: 'dimarts' },
  { short: 'dc.', long: 'dimecres' },
  { short: 'dj.', long: 'dijous' },
  { short: 'dv.', long: 'divendres' },
  { short: 'ds.', long: 'dissabte' },
  { short: 'dg.', long: 'diumenge' },
];

function pad(n) {
  return String(n).padStart(2, '0');
}

export function isoOf(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function localToday() {
  const t = new Date();
  return isoOf(t.getFullYear(), t.getMonth(), t.getDate());
}

export function monthCells(year, month) {
  const padStart = (new Date(year, month, 1).getDay() + 6) % 7;
  const last = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: padStart }, () => null);
  for (let d = 1; d <= last; d++) cells.push({ day: d, iso: isoOf(year, month, d) });
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function onDay(events, iso) {
  return events.filter((e) => iso >= e.date && iso <= (e.endDate || e.date));
}

export function labelMonth(year, month) {
  const raw = new Date(year, month, 1).toLocaleDateString('ca', {
    month: 'long',
    year: 'numeric',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
