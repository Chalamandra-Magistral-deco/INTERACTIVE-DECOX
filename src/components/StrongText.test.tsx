import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StrongText from "./StrongText";

describe("StrongText", () => {
  it("renders only the supported strong syntax as HTML", () => {
    const { container } = render(
      <StrongText>
        {"Texto **resaltado** <script>alert('xss')</script>"}
      </StrongText>,
    );

    expect(container.querySelector("strong")?.textContent).toBe("resaltado");
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain("<script>alert('xss')</script>");
  });
});
