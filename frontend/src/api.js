const base = import.meta.env.VITE_API_URL || '';
const API = base ? `${String(base).replace(/\/$/, '')}/api` : '/api';

// Common fetch options for CORS with credentials
const fetchOptions = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
};

export async function getSlots() {
  const r = await fetch(`${API}/slots`, fetchOptions);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getUsers() {
  const r = await fetch(`${API}/users`, fetchOptions);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getUser(id) {
  const r = await fetch(`${API}/users/${id}`, fetchOptions);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getBookings(params = {}) {
  const q = new URLSearchParams(params).toString();
  const r = await fetch(`${API}/bookings${q ? '?' + q : ''}`, fetchOptions);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function createBooking({ user_id, slot_id, booking_date }) {
  const r = await fetch(`${API}/bookings`, {
    ...fetchOptions,
    method: 'POST',
    body: JSON.stringify({ user_id, slot_id, booking_date }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || r.statusText);
  return data;
}

export async function cancelBooking(id) {
  const r = await fetch(`${API}/bookings/${id}/cancel`, { 
    ...fetchOptions,
    method: 'PATCH' 
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || r.statusText);
  return data;
}

export async function markNoShow(id) {
  const r = await fetch(`${API}/bookings/${id}/no-show`, { 
    ...fetchOptions,
    method: 'PATCH' 
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || r.statusText);
  return data;
}

export async function setBookingVehicle(bookingId, vehicle_id) {
  const r = await fetch(`${API}/bookings/${bookingId}/vehicle`, {
    ...fetchOptions,
    method: 'PATCH',
    body: JSON.stringify({ vehicle_id }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || r.statusText);
  return data;
}

export async function getSlotCanBook(slotId, date) {
  const r = await fetch(`${API}/slots/${slotId}/can-book?date=${date}`, fetchOptions);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getBookableDate(date) {
  const r = await fetch(`${API}/bookable-date?date=${date}`, fetchOptions);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getVehicles() {
  const r = await fetch(`${API}/vehicles`, fetchOptions);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
