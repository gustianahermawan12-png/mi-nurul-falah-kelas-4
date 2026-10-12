import { LoginPage } from "@/pages/LoginPage";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createActorMock } from "./actorMock";
import type { ActorMock } from "./actorMock";
import { renderWithProviders } from "./harness";

const { holder, navigate } = vi.hoisted(() => ({
  holder: { actor: undefined as unknown as ActorMock },
  navigate: vi.fn(),
}));

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: holder.actor, isFetching: false }),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    holder.actor = createActorMock();
    holder.actor.getTeacherCredentials.mockResolvedValue({
      username: "guru",
      password: "guru123",
    });
  });

  it("shows the seeded teacher credentials as a hint", async () => {
    renderWithProviders(<LoginPage />);

    await userEvent.click(screen.getByTestId("login.tab.guru"));

    const hint = await screen.findByTestId("login.teacher_credentials");
    expect(hint).toHaveTextContent("guru");
    expect(hint).toHaveTextContent("guru123");
  });

  it("logs a teacher in and opens the admin panel", async () => {
    holder.actor.loginTeacher.mockResolvedValue({
      __kind__: "ok",
      ok: { token: "t1", kind: "guru", createdAt: 0n },
    });

    renderWithProviders(<LoginPage />);
    await userEvent.click(screen.getByTestId("login.tab.guru"));
    await userEvent.type(screen.getByTestId("login.input.identifier"), "guru");
    await userEvent.type(screen.getByTestId("login.input.password"), "guru123");
    await userEvent.click(screen.getByTestId("login.submit_button"));

    await waitFor(() => {
      expect(holder.actor.loginTeacher).toHaveBeenCalledWith("guru", "guru123");
    });
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ to: "/admin" });
    });
  });

  it("logs a parent in with NISN and opens the parent dashboard", async () => {
    holder.actor.loginParent.mockResolvedValue({
      __kind__: "ok",
      ok: { token: "p1", kind: "orangTua", studentId: 7n, createdAt: 0n },
    });

    renderWithProviders(<LoginPage />);
    await userEvent.type(
      screen.getByTestId("login.input.identifier"),
      "1234567890",
    );
    await userEvent.type(screen.getByTestId("login.input.password"), "sandi");
    await userEvent.click(screen.getByTestId("login.submit_button"));

    await waitFor(() => {
      expect(holder.actor.loginParent).toHaveBeenCalledWith(
        "1234567890",
        "sandi",
      );
    });
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ to: "/" });
    });
  });

  it("surfaces a backend login error", async () => {
    holder.actor.loginParent.mockResolvedValue({
      __kind__: "err",
      err: "Kredensial salah",
    });

    renderWithProviders(<LoginPage />);
    await userEvent.type(screen.getByTestId("login.input.identifier"), "999");
    await userEvent.type(screen.getByTestId("login.input.password"), "salah");
    await userEvent.click(screen.getByTestId("login.submit_button"));

    expect(await screen.findByTestId("login.error_state")).toHaveTextContent(
      "Kredensial salah",
    );
    expect(navigate).not.toHaveBeenCalled();
  });
});
