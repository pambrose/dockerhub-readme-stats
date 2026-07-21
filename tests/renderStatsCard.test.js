const { renderStatsCard } = require("../src/renderStatsCard");

const mockStats = {
  name: "nginx",
  namespace: "library",
  fullName: "library/nginx",
  description: "Official Nginx image",
  pullCount: 1000000000,
  starCount: 1500,
  lastUpdated: "2024-01-15T10:30:00Z",
  isOfficial: true,
};

describe("renderStatsCard", () => {
  test("renders a valid SVG", () => {
    const svg = renderStatsCard(mockStats);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("xmlns=\"http://www.w3.org/2000/svg\"");
  });

  test("includes stats in the SVG", () => {
    const svg = renderStatsCard(mockStats);
    expect(svg).toContain("Total Pulls");
    expect(svg).toContain("1B");
    expect(svg).toContain("Stars");
    expect(svg).toContain("1.5K");
    expect(svg).toContain("Latest Release");
  });

  test("puts the version in the label when one was found", () => {
    const svg = renderStatsCard({ ...mockStats, version: "1.31.3" });
    expect(svg).toContain("1.31.3 Released");
    expect(svg).not.toContain("Latest Release");
  });

  test("falls back to Latest Release when no version was found", () => {
    expect(renderStatsCard({ ...mockStats, version: null })).toContain(
      "Latest Release"
    );
    expect(renderStatsCard(mockStats)).toContain("Latest Release");
  });

  test("still shows the date alongside the version", () => {
    const svg = renderStatsCard({ ...mockStats, version: "1.31.3" });
    expect(svg).toContain("1.31.3 Released");
    expect(svg).toContain("Jan 15, 2024");
  });

  test("hide=updated removes the row regardless of version", () => {
    const svg = renderStatsCard(
      { ...mockStats, version: "1.31.3" },
      { hide: "updated" }
    );
    expect(svg).not.toContain("1.31.3 Released");
    expect(svg).not.toContain("Latest Release");
  });

  test("includes title with image name", () => {
    const svg = renderStatsCard(mockStats);
    expect(svg).toContain("library/nginx Stats");
  });

  test("supports custom title", () => {
    const svg = renderStatsCard(mockStats, { custom_title: "My Image" });
    expect(svg).toContain("My Image");
    expect(svg).not.toContain("library/nginx Stats");
  });

  test("hides title when hide_title is true", () => {
    const svg = renderStatsCard(mockStats, { hide_title: true });
    expect(svg).not.toContain("library/nginx Stats");
  });

  test("hides specific stats", () => {
    const svg = renderStatsCard(mockStats, { hide: "stars,updated" });
    expect(svg).toContain("Total Pulls");
    expect(svg).not.toContain(">Stars<");
    expect(svg).not.toContain("Latest Release");
  });

  test("applies theme colors", () => {
    const svg = renderStatsCard(mockStats, { theme: "dark" });
    expect(svg).toContain("#151515"); // dark bg
  });

  test("falls back to default theme for unknown theme", () => {
    const svg = renderStatsCard(mockStats, { theme: "nonexistent" });
    expect(svg).toContain("#ffffff"); // default bg
  });

  test("supports custom colors", () => {
    const svg = renderStatsCard(mockStats, { bg_color: "ff0000" });
    expect(svg).toContain("#ff0000");
  });

  test("hides border when hide_border is true", () => {
    const svg = renderStatsCard(mockStats, { hide_border: true });
    expect(svg).not.toContain("stroke-opacity");
  });
});
