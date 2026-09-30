"use strict";
// Shared by the public gallery and the local list editor.
window.katuriYouTubeId = function (value) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    let id = null;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
      const parts = url.pathname.split('/');
      if (url.pathname === '/watch') id = url.searchParams.get('v');
      else if (['shorts', 'embed', 'live'].includes(parts[1])) id = parts[2];
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id || '') ? id : null;
  } catch (_) { return null; }
};
