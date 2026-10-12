import { createActor } from "@/backend";
import type { Session } from "@/backend";
import { SessionContext } from "@/hooks/useSession";
import type { SessionContextValue } from "@/hooks/useSession";
import { clearSession, loadSession, saveSession } from "@/lib/session";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    if (!actor || isFetching) return;
    const stored = loadSession();
    if (!stored) {
      setRestoring(false);
      return;
    }
    let cancelled = false;
    void actor
      .getSession(stored.token)
      .then((restoredSession) => {
        if (cancelled) return;
        if (restoredSession) {
          setSession(restoredSession);
        } else {
          clearSession();
        }
      })
      .catch(() => {
        if (!cancelled) clearSession();
      })
      .finally(() => {
        if (!cancelled) setRestoring(false);
      });
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      isTeacher: session?.kind === "guru",
      login: (next: Session) => {
        saveSession(next);
        setSession(next);
      },
      logout: () => {
        if (session) {
          void actor?.logout(session.token);
        }
        clearSession();
        setSession(null);
        queryClient.clear();
      },
    }),
    [session, actor, queryClient],
  );

  if (restoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2
          className="h-6 w-6 animate-spin text-primary"
          aria-hidden="true"
        />
        <span className="sr-only">Memuat sesi…</span>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
