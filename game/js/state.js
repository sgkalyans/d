// Shared state via localStorage
const TOW = {
  save(key, val) { localStorage.setItem('tow_' + key, JSON.stringify(val)); },
  load(key, def) {
    const v = localStorage.getItem('tow_' + key);
    return v !== null ? JSON.parse(v) : def;
  },
  clear() {
    ['team1','team2','difficulty','score1','score2'].forEach(k => localStorage.removeItem('tow_' + k));
  }
};
