import type { Session } from "@/backend";
import { SessionContext } from "@/hooks/useSession";
import type { SessionContextValue } from "@/hooks/useSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { vi } from "vitest";

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function makeSession(overrides: Partial<Session> = {}): Session {
  return {
    token: "token",
    kind: "orangTua" as Session["kind"],
    studentId: 7n,
    createdAt: 0n,
    ...overrides,
  };
}

export function makeSessionContext(
  overrides: Partial<SessionContextValue> = {},
): SessionContextValue {
  return {
    session: makeSession(),
    isTeacher: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}

export function renderWithProviders(
  ui: ReactElement,
  options: {
    session?: SessionContextValue;
    queryClient?: QueryClient;
  } = {},
): { queryClient: QueryClient; session: SessionContextValue } {
  const queryClient = options.queryClient ?? createTestQueryClient();
  const session = options.session ?? makeSessionContext();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={session}>
          {children}
        </SessionContext.Provider>
      </QueryClientProvider>
    );
  }

  render(ui, { wrapper: Wrapper });
  return { queryClient, session };
}
