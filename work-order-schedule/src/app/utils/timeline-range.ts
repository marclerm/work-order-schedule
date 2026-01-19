import { Timescale } from "../models/timeline.types";

export type TimelineColumnRange = {
    key: string; //id of the column
    label: string; // display label of the column
    start: Date; // start date of the column
    end: Date; // end date of the column
};

const MONTH_FORMAT: Intl.DateTimeFormatOptions = { month: 'short' };
const LOCAL_US = 'en-US';

// Start date of the day (00:00:00)
function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Add days to a date
function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Start date of the week (Monday as first day)
function startOfWeekMonday(date: Date): Date {
    const x = startOfDay(date);
    const day = x.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // adjust when day is sunday
    return addDays(x, diff);
}

// Start date of the month (1st day)
function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Add months to a date
function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

// Give format like 'Jan', 'Feb', etc.
function formatMonth(date: Date): string {
    return date.toLocaleString(LOCAL_US, MONTH_FORMAT) +` ${date.getFullYear().toString().slice(-2)}`;
}

function formatWeekLabel(start: Date): string {
    const m = start.toLocaleDateString(LOCAL_US, MONTH_FORMAT);
    const day = start.getDate().toString().padStart(2, '0');
    return `Week ${m} ${day}`;
}
function formatDayLabel(date: Date): string {
    const m = date.toLocaleDateString(LOCAL_US, MONTH_FORMAT);
    const day = date.getDate().toString().padStart(2, '0');
    return `${m} ${day}`;
}

export function buildColumnRanges(timescale: Timescale, anchor = new Date()): TimelineColumnRange[] {
     const today = startOfDay(anchor);

     if(timescale === 'month') {
        const start = addMonths(startOfMonth(today), -2);
        const count = 14; // 14 months total (2 back + current + 11 forward = 14) eaquls almost 1 year

        return Array.from({ length: count }).map((_, i) => {
            const s = addMonths(start, i);
            const e = addMonths(s, 1);
            const label = formatMonth(s);
            return {
                key: `${s.getFullYear()}-${s.getMonth() + 1}`,
                label,
                start: s,
                end: e,
            };
        });
     }
     else if(timescale === 'week') {
        const start = addDays(startOfWeekMonday(today), -14); // 2 weeks back
        const count = 55; // 54 weeks total (2 back + current + 52 forward = 54) equals almost 1 year
        
        return Array.from({ length: count }).map((_, i) => {
            const s = addDays(start, i * 7);
            const e = addDays(s, 7);
            const label = formatWeekLabel(s);
            return {
                key: `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()}`,
                label,
                start: s,
                end: e,
            };
        });
     }    else { // day
        const start = addDays(today, -14); // 14 days back
        const count = 382; // (14 back + current + 367 forward = 382) equals almost 1 year

        return Array.from({ length: count }).map((_, i) => {
            const s = addDays(start, i);
            const e = addDays(s, 1);
            const label = formatDayLabel(s);
            return {
                key: `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()}`,
                label,
                start: s,
                end: e,
            };
        });
    }
}