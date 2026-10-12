import type { Session } from "@/backend";
import { createContext, useContext } from "react";

export interface SessionContextValue {
  session: Session | null;
  isTeacher: boolean;
  login: (session: Session) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
