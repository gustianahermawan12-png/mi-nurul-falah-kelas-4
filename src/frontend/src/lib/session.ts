import type { Session } from "@/backend";

const SESSION_KEY = "mi-nurul-falah.session";

export interface StoredSession {
  token: string;
  kind: Session["kind"];
  studentId?: string;
  createdAt: string;
}

export function saveSession(session: Session): void {
  const stored: StoredSession = {
    token: session.token,
    kind: session.kind,
    studentId:
      session.studentId !== undefined
        ? session.studentId.toString()
        : undefined,
    createdAt: session.createdAt.toString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
}

export function loadSession(): StoredSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.token || !parsed.kind) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
