/**
 * Business rules for shuttle booking
 * - Morning slots (7:30, 8:30): book by 8 PM previous evening
 * - Evening slots (17:00, 18:00): book by 3 PM same day
 * - Cancel: allowed until 1 hour before slot start
 * - 3 consecutive no-shows -> block booking for 2 days
 */

function parseDate(s) {
  return s ? new Date(s.replace(' ', 'T')) : null;
}

function toDateOnly(d) {
  const x = new Date(d);
  return x.toISOString().slice(0, 10);
}

function toLocalISO(d) {
  const x = new Date(d);
  const pad = (n) => String(n).padStart(2, '0');
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}:00`;
}

/** Slot is morning (metro->office) or evening (office->metro) */
function isMorningSlot(slot) {
  return slot && slot.direction === 'morning_to_office';
}

/** Get cutoff datetime for booking a slot on bookingDate (YYYY-MM-DD). */
function getBookingCutoff(slot, bookingDateStr) {
  const slotTime = slot.time; // "07:30" or "17:00"
  const [h, m] = slotTime.split(':').map(Number);
  if (isMorningSlot(slot)) {
    // Morning: cutoff is previous day 8 PM (20:00)
    const d = new Date(bookingDateStr + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    d.setHours(20, 0, 0, 0);
    return d;
  } else {
    // Evening: cutoff is same day 3 PM (15:00)
    const d = new Date(bookingDateStr + 'T00:00:00');
    d.setHours(15, 0, 0, 0);
    return d;
  }
}

/** Check if current time is past booking cutoff for this slot on this date. */
function isPastBookingCutoff(slot, bookingDateStr) {
  const cutoff = getBookingCutoff(slot, bookingDateStr);
  return new Date() > cutoff;
}

/** Slot start datetime on the given date. */
function getSlotStart(slot, dateStr) {
  const [h, m] = slot.time.split(':').map(Number);
  const d = new Date(dateStr + 'T00:00:00');
  d.setHours(h, m, 0, 0);
  return d;
}

/** True if the slot start time on the given date has already passed (server local time). */
function isSlotStartInPast(slot, dateStr) {
  const start = getSlotStart(slot, dateStr);
  return start <= new Date();
}

/** Cancel allowed until 1 hour before slot start. */
function canCancel(booking, slot, now = new Date()) {
  if (booking.status !== 'booked') return false;
  const start = getSlotStart(slot, booking.booking_date);
  const oneHourBefore = new Date(start.getTime() - 60 * 60 * 1000);
  return now < oneHourBefore;
}

/** Consecutive no-shows: count from most recent backwards. */
function getConsecutiveNoShows(getBookingsForUser) {
  const rows = getBookingsForUser();
  let count = 0;
  for (const r of rows) {
    if (r.status === 'no_show') count++;
    else break;
  }
  return count;
}

/** Set blocked_until to now + 2 days if user has 3+ consecutive no-shows. */
function updateBlockIfNeeded(getBookingsForUser, setUserBlockedUntil, userId) {
  const consecutive = getConsecutiveNoShows(getBookingsForUser);
  if (consecutive < 3) return;
  const blockedUntil = new Date();
  blockedUntil.setDate(blockedUntil.getDate() + 2);
  const str = blockedUntil.toISOString().slice(0, 19).replace('T', ' ');
  setUserBlockedUntil(userId, str);
}

/** Check if user is currently blocked (blocked_until in future). */
function isUserBlocked(user) {
  if (!user || !user.blocked_until) return false;
  return new Date(user.blocked_until) > new Date();
}

module.exports = {
  parseDate,
  toDateOnly,
  toLocalISO,
  isMorningSlot,
  getBookingCutoff,
  isPastBookingCutoff,
  getSlotStart,
  isSlotStartInPast,
  canCancel,
  getConsecutiveNoShows,
  updateBlockIfNeeded,
  isUserBlocked,
};
