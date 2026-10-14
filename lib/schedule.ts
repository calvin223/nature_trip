// Deterministic departure-date generator.
//
// Each trip in lib/data.ts carries `seasonMonths`, `durationDays` and a
// `departureRule` (e.g. "third Saturday of each in-season month"). From those,
// getDepartures() lists the next N start dates that:
//   1. start AND finish inside the trip's season months, and
//   2. start no earlier than max(build date, SITE.launchDate) + SITE.bookingLeadDays.
//
// Design notes
// - Every date is a calendar date with no time of day, carried as an ISO
//   string "YYYY-MM-DD" in and out, and as a whole-day number (days since
//   1970-01-01, computed with Date.UTC) internally. No local-time Date methods
//   are used, so the result never shifts with the machine's time zone.
// - All functions are pure except buildDate(), which reads the clock or the
//   BUILD_DATE environment variable.
// - Call getDepartures() in server components (it runs at build time in the
//   static export) and pass the resulting strings down to client components.
//   In a client bundle process.env.BUILD_DATE is not inlined, so calling it
//   there would fall back to the visitor's "today" and could disagree with the
//   pre-rendered HTML.
// - Invalid input throws. A wrong schedule must break the build, not quietly
//   publish dates that are out of season.

import type { DepartureRule, Trip } from './data';
import { SITE } from './site';

const DAY_MS = 86_400_000;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const MONTH_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;
const ORDINAL: Record<string, string> = { '1': 'first', '2': 'second', '3': 'third', '4': 'fourth', '-1': 'last' };

/** Search horizon. Any valid rule yields a departure well within this. */
const HORIZON_MONTHS = 60;

interface Ymd { y: number; m: number; d: number } // m is 1-12

// ---------------------------------------------------------------------------
// Date-only primitives (UTC date parts only)
// ---------------------------------------------------------------------------

/** Parse "YYYY-MM-DD" to a day number. Throws on malformed or impossible dates. */
function toDay(iso: string, label: string): number {
  const match = ISO_DATE.exec(iso);
  if (!match) throw new Error(`${label}: expected YYYY-MM-DD, got "${iso}"`);
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const ms = Date.UTC(y, m - 1, d);
  const check = new Date(ms);
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) {
    throw new Error(`${label}: "${iso}" is not a real calendar date`);
  }
  return ms / DAY_MS;
}

function ymdOf(day: number): Ymd {
  const dt = new Date(day * DAY_MS);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

function weekdayOf(day: number): number {
  return new Date(day * DAY_MS).getUTCDay(); // 0 = Sunday
}

function dayOf(y: number, m: number, d: number): number {
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function toIso(day: number): string {
  const { y, m, d } = ymdOf(day);
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

/** Validate an ISO date string without converting it. Throws if invalid. */
export function assertIsoDate(iso: string, label = 'date'): string {
  toDay(iso, label);
  return iso;
}

/** ISO date `n` days after `iso` (n may be negative). */
export function addDays(iso: string, n: number): string {
  if (!Number.isInteger(n)) throw new Error(`addDays: n must be an integer, got ${n}`);
  return toIso(toDay(iso, 'addDays') + n);
}

// ---------------------------------------------------------------------------
// Build date
// ---------------------------------------------------------------------------

/** Today's date in `timeZone` as YYYY-MM-DD, independent of the host's zone. */
export function todayIn(timeZone: string, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string): string => {
    const part = parts.find((p) => p.type === type);
    if (!part) throw new Error(`todayIn: Intl did not return a "${type}" part for ${timeZone}`);
    return part.value;
  };
  return assertIsoDate(`${get('year')}-${get('month')}-${get('day')}`, `todayIn(${timeZone})`);
}

/**
 * The date the schedule is computed from: process.env.BUILD_DATE (YYYY-MM-DD)
 * when set, otherwise today in Asia/Kolkata (SITE.timeZone). Set BUILD_DATE to
 * make a build reproducible, e.g. `BUILD_DATE=2026-10-03 npm run build`.
 */
export function buildDate(): string {
  const fromEnv = typeof process !== 'undefined' ? process.env.BUILD_DATE : undefined;
  if (fromEnv !== undefined && fromEnv !== '') return assertIsoDate(fromEnv, 'BUILD_DATE');
  return todayIn(SITE.timeZone);
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/** Day number of the nth `weekday` of a month; nth = -1 means the last one. */
function nthWeekday(y: number, m: number, weekday: number, nth: number): number {
  if (nth === -1) {
    const last = dayOf(y, m, daysInMonth(y, m));
    return last - ((weekdayOf(last) - weekday + 7) % 7);
  }
  const first = dayOf(y, m, 1);
  const date = 1 + ((weekday - weekdayOf(first) + 7) % 7) + (nth - 1) * 7;
  if (date > daysInMonth(y, m)) throw new Error(`nthWeekday: no ${nth}th weekday ${weekday} in ${y}-${pad2(m)}`);
  return first + date - 1;
}

function validateTrip(trip: Trip): void {
  const where = `trip "${trip.id}"`;
  if (!Number.isInteger(trip.durationDays) || trip.durationDays < 1 || trip.durationDays > 27) {
    throw new Error(`${where}: durationDays must be an integer from 1 to 27, got ${trip.durationDays}`);
  }
  if (!trip.duration.startsWith(`${trip.durationDays} days`)) {
    throw new Error(`${where}: durationDays (${trip.durationDays}) disagrees with duration "${trip.duration}"`);
  }
  if (trip.seasonMonths.length === 0) throw new Error(`${where}: seasonMonths is empty`);
  for (const month of trip.seasonMonths) {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error(`${where}: seasonMonths contains ${month}; months are 1-12`);
    }
  }
  const rule: DepartureRule = trip.departureRule;
  if (!Number.isInteger(rule.weekday) || rule.weekday < 0 || rule.weekday > 6) {
    throw new Error(`${where}: departureRule.weekday must be 0-6 (0 = Sunday), got ${rule.weekday}`);
  }
  if (rule.nth.length === 0) throw new Error(`${where}: departureRule.nth is empty`);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Earliest allowed departure: max(now, SITE.launchDate) + SITE.bookingLeadDays. */
export function earliestDeparture(now: string = buildDate()): string {
  const nowDay = toDay(now, 'now');
  const launchDay = SITE.launchDate === null ? null : toDay(SITE.launchDate, 'SITE.launchDate');
  const base = launchDay !== null && launchDay > nowDay ? launchDay : nowDay;
  return toIso(base + SITE.bookingLeadDays);
}

/**
 * The next `count` departure dates (ISO "YYYY-MM-DD") for a trip, in order.
 * A date qualifies when it matches the trip's departure rule, both the first
 * and last day of the trip fall in `seasonMonths`, and it is on or after
 * earliestDeparture(now). Throws if fewer than `count` exist within 5 years.
 */
export function getDepartures(trip: Trip, count: number = 3, now: string = buildDate()): string[] {
  if (!Number.isInteger(count) || count < 0) throw new Error(`getDepartures: count must be a non-negative integer, got ${count}`);
  validateTrip(trip);

  const earliest = toDay(earliestDeparture(now), 'earliest');
  const inSeason = new Set(trip.seasonMonths);
  const { weekday, nth } = trip.departureRule;
  const found: number[] = [];

  let { y, m } = ymdOf(earliest);
  for (let i = 0; i < HORIZON_MONTHS && found.length < count; i++) {
    if (inSeason.has(m)) {
      const starts = nth.map((n) => nthWeekday(y, m, weekday, n)).sort((a, b) => a - b);
      for (const start of starts) {
        if (found.length >= count) break;
        if (start < earliest || found.includes(start)) continue;
        const end = start + trip.durationDays - 1;
        if (!inSeason.has(ymdOf(end).m)) continue; // would run past the end of the season
        found.push(start);
      }
    }
    m += 1;
    if (m > 12) { m = 1; y += 1; }
  }

  if (found.length < count) {
    throw new Error(
      `getDepartures: only ${found.length} of ${count} departures found for trip "${trip.id}" ` +
      `within ${HORIZON_MONTHS} months of ${toIso(earliest)}; check seasonMonths and departureRule`,
    );
  }
  return found.map(toIso);
}

/** Last day of a trip that starts on `startIso`. */
export function departureEnd(trip: Trip, startIso: string): string {
  validateTrip(trip);
  return addDays(startIso, trip.durationDays - 1);
}

/** "Sat 5 Dec 2026" (en-GB order, fixed English names; no Intl, so no locale drift). */
export function formatDate(iso: string): string {
  const day = toDay(iso, 'formatDate');
  const { y, m, d } = ymdOf(day);
  return `${WEEKDAY_SHORT[weekdayOf(day)]} ${d} ${MONTH_SHORT[m - 1]} ${y}`;
}

/** "Sat 21 Nov – Mon 30 Nov 2026", or with both years when the trip crosses New Year. */
export function formatDepartureRange(trip: Trip, startIso: string): string {
  const endIso = departureEnd(trip, startIso);
  const start = formatDate(startIso);
  const end = formatDate(endIso);
  if (startIso.slice(0, 4) === endIso.slice(0, 4)) {
    return `${start.slice(0, start.lastIndexOf(' '))} – ${end}`;
  }
  return `${start} – ${end}`;
}

/** Plain-English rule, e.g. "Departs on the third Saturday of October, November, December and January". */
export function describeDepartureRule(trip: Trip): string {
  validateTrip(trip);
  const { weekday, nth } = trip.departureRule;
  const which = nth.map((n) => ORDINAL[String(n)]).join(' and ');
  const months = trip.seasonMonths.map((mo) => MONTH_LONG[mo - 1]);
  const monthList = months.length > 1 ? `${months.slice(0, -1).join(', ')} and ${months[months.length - 1]}` : months[0];
  return `Departs on the ${which} ${WEEKDAY_LONG[weekday]} of ${monthList}`;
}
