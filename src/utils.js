function formatNumber(num) {
  if (num < 1_000) return String(num);
  const units = ["K", "M", "B"];
  let unit = 0;
  let value = num / 1_000;
  // Choose the unit after rounding, so 999,999 becomes "1M", not "1000K"
  while (unit < units.length - 1 && Number(value.toFixed(1)) >= 1_000) {
    value /= 1_000;
    unit++;
  }
  return value.toFixed(1).replace(/\.0$/, "") + units[unit];
}

function escapeXml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseBoolean(value) {
  return value === "true" || value === "1" || value === "";
}

function formatDate(isoString) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function normalizeColor(override, fallback) {
  const raw = override || fallback;
  return raw.startsWith("#") ? raw : `#${raw}`;
}

module.exports = { formatNumber, escapeXml, parseBoolean, formatDate, normalizeColor };
