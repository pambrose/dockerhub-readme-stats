function formatNumber(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return String(num);
}

// Exact count with thousands separators, for the card, which has room
// for it. Badges stay abbreviated via formatNumber.
function formatCount(num) {
  return num.toLocaleString("en-US");
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

module.exports = { formatNumber, formatCount, escapeXml, parseBoolean, formatDate, normalizeColor };
