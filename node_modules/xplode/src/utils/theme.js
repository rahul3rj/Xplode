const KEY = "xplode-theme";

export function readTheme() {
  try { return localStorage.getItem(KEY) === "light" ? "light" : "dark"; }
  catch { return "dark"; }
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function saveTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

export function watchTheme(callback) {
  const onStorage = (event) => {
    if (event.key !== KEY && event.key !== null) return;
    const theme = readTheme();
    applyTheme(theme);
    callback(theme);
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
