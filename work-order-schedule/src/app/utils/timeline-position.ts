import { TimelineColumnRange } from "./timeline-range";

function parseISODateToLocal(dateString: string): Date {
  const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    // Ensure we're at the start of the day
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getTimelinePosition(args: {
  columns: TimelineColumnRange[];
  colWidthPx: number;
  startIso: string;
  endIso: string;
}): { leftPx: number; widthPx: number } | null {
  const { columns, colWidthPx, startIso, endIso } = args;
  // Convert ISO strings to local Date objects
  const startDate = parseISODateToLocal(startIso).getTime();
  const endDate = parseISODateToLocal(endIso).getTime() + (24 * 60 * 60 * 1000); // include the entire end day
  // Get timeline start and end from columns
  const firstCol = columns[0];
  const lastCol = columns[columns.length - 1];

  if(!firstCol || !lastCol)
    return null;

  const timelineStart = firstCol.start.getTime();
  const timelineEnd = lastCol.end.getTime();
  // Obtain the effective start and end within the timeline bounds to avoid overflow
  const s = Math.max(startDate, timelineStart);
  const e = Math.min(endDate, timelineEnd);

  if (s >= e) 
    return null;
  // Find the start and end column indices to calculate pixel positions
  const startColIndex = columns.findIndex(c => s >= c.start.getTime() && s < c.end.getTime());
  const endColIndex = columns.findIndex(c => e > c.start.getTime() && e <= c.end.getTime());

  const startCol = columns[startColIndex];
  const endCol = columns[endColIndex];
  // Calculate fractional positions within the start and end columns to have an accurate positioning
  const startFrac = (s - startCol.start.getTime()) / (startCol.end.getTime() - startCol.start.getTime());
  const endFrac = (e - endCol.start.getTime()) / (endCol.end.getTime() - endCol.start.getTime());
  // Calculate final pixel positions based on the column index multiplied by column width and adding the fractional part
  const leftPx = Math.round(startColIndex * colWidthPx + startFrac * colWidthPx);
  const rightPx = Math.round(endColIndex * colWidthPx + endFrac * colWidthPx);
  const widthPx = rightPx - leftPx;

  return { leftPx, widthPx };
}

