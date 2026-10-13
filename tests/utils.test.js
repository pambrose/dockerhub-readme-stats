const { formatNumber, escapeXml, parseBoolean, formatDate } = require("../src/utils");

describe("formatNumber", () => {
  test("formats numbers below 1000", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(1)).toBe("1");
    expect(formatNumber(999)).toBe("999");
  });

  test("formats thousands", () => {
    expect(formatNumber(1000)).toBe("1K");
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(10000)).toBe("10K");
    expect(formatNumber(999949)).toBe("999.9K");
  });

  test("moves to the next unit when rounding reaches 1000", () => {
    expect(formatNumber(999999)).toBe("1M");
    expect(formatNumber(999949999)).toBe("999.9M");
    expect(formatNumber(999999999)).toBe("1B");
  });

  test("formats millions", () => {
    expect(formatNumber(1000000)).toBe("1M");
    expect(formatNumber(2500000)).toBe("2.5M");
    expect(formatNumber(100000000)).toBe("100M");
  });

  test("formats billions", () => {
    expect(formatNumber(1000000000)).toBe("1B");
    expect(formatNumber(5500000000)).toBe("5.5B");
  });
});

describe("escapeXml", () => {
  test("escapes special XML characters", () => {
    expect(escapeXml("hello & world")).toBe("hello &amp; world");
    expect(escapeXml("<script>")).toBe("&lt;script&gt;");
    expect(escapeXml('"quotes"')).toBe("&quot;quotes&quot;");
    expect(escapeXml("it's")).toBe("it&apos;s");
  });

  test("returns non-string values as-is", () => {
    expect(escapeXml(123)).toBe(123);
    expect(escapeXml(null)).toBe(null);
  });
});

describe("parseBoolean", () => {
  test("returns true for truthy strings", () => {
    expect(parseBoolean("true")).toBe(true);
    expect(parseBoolean("1")).toBe(true);
    expect(parseBoolean("")).toBe(true);
  });

  test("returns false for other values", () => {
    expect(parseBoolean("false")).toBe(false);
    expect(parseBoolean("0")).toBe(false);
    expect(parseBoolean(undefined)).toBe(false);
  });
});

describe("formatDate", () => {
  test("formats ISO date strings", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  test("returns N/A for null", () => {
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate(undefined)).toBe("N/A");
  });
});
