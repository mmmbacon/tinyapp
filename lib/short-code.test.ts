import { describe, expect, it } from "vitest";
import { generateShortCode } from "@/lib/short-code";

describe("generateShortCode", () => {
  it("returns a string of the requested length", () => {
    expect(generateShortCode(6)).toHaveLength(6);
    expect(generateShortCode(8)).toHaveLength(8);
  });

  it("uses only alphanumeric characters", () => {
    const code = generateShortCode(12);
    expect(code).toMatch(/^[A-Za-z0-9]+$/);
  });
});
