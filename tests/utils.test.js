const { formatNumber, formatCount, escapeXml, parseBoolean, formatDate } = require("../src/utils");

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
    expect(formatNumber(999999)).toBe("1000K");
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

describe("formatCount", () => {
  test("leaves numbers below 1000 unchanged", () => {
    expect(formatCount(0)).toBe("0");
    expect(formatCount(1)).toBe("1");
    expect(formatCount(999)).toBe("999");
  });

  test("groups thousands with commas", () => {
    expect(formatCount(1000)).toBe("1,000");
    expect(formatCount(1006986)).toBe("1,006,986");
    expect(formatCount(13512345678)).toBe("13,512,345,678");
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
