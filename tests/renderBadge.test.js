const { renderBadge } = require("../src/renderBadge");

const mockStats = {
  pullCount: 5000000,
  starCount: 200,
};

describe("renderBadge", () => {
  test("renders a valid SVG badge", () => {
    const svg = renderBadge(mockStats);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  test("includes pull count", () => {
    const svg = renderBadge(mockStats);
    expect(svg).toContain("5M");
  });

  test("includes default label", () => {
    const svg = renderBadge(mockStats);
    expect(svg).toContain("Docker Pulls");
  });

  test("supports custom label", () => {
    const svg = renderBadge(mockStats, { label: "Downloads" });
    expect(svg).toContain("Downloads");
  });

  test("renders for-the-badge style", () => {
    const svg = renderBadge(mockStats, { style: "for-the-badge" });
    expect(svg).toContain("DOCKER PULLS");
  });

  test("uses default colors", () => {
    const svg = renderBadge(mockStats);
    expect(svg).toContain('fill="#066da5"');
    expect(svg).toContain('fill="#555555"');
  });

  test("prepends # to colors passed without one", () => {
    const svg = renderBadge(mockStats, { color: "ff0000", label_color: "00ff00" });
    expect(svg).toContain('fill="#ff0000"');
    expect(svg).toContain('fill="#00ff00"');
  });

  test("leaves colors that already have # unchanged", () => {
    const svg = renderBadge(mockStats, { color: "#ff0000", label_color: "#00ff00" });
    expect(svg).toContain('fill="#ff0000"');
    expect(svg).toContain('fill="#00ff00"');
    expect(svg).not.toContain('fill="##ff0000"');
  });

  test("normalizes colors in for-the-badge style", () => {
    const svg = renderBadge(mockStats, {
      style: "for-the-badge",
      color: "ff0000",
      label_color: "00ff00",
    });
    expect(svg).toContain('fill="#ff0000"');
    expect(svg).toContain('fill="#00ff00"');
  });
});
