// Thin wrapper around room-code generation so the PeerJS room-naming scheme
// lives in one place and can be swapped out later (e.g. for a real backend).

export function roomIdFromCode(code) {
  return 'twoup-' + code;
}

export function generateRoomCode() {
  return Math.random().toString(36).slice(2, 8);
}

export function buildShareLink(code) {
  const url = new URL(window.location.href);
  url.searchParams.set('room', code);
  return url.toString();
}

export function clearRoomFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('room');
  window.history.replaceState({}, '', url.toString());
}
