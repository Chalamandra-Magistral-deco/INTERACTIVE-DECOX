import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ConsentPage from "./ConsentPage";

describe("ConsentPage", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "");
    window.history.replaceState(
      {},
      "",
      "/oauth/consent?authorization_id=test",
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    window.history.replaceState({}, "", "/");
  });

  it("reports missing Supabase settings without failing module initialization", async () => {
    render(<ConsentPage />);

    expect(
      await screen.findByText(
        "Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en el entorno.",
      ),
    ).toBeInTheDocument();
  });
});
