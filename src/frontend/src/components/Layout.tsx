import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CalendarCheck,
  GraduationCap,
  LayoutDashboard,
  UserCircle,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

const parentTabs = [
  { to: "/", label: "Dasbor", icon: LayoutDashboard },
  { to: "/nilai", label: "Nilai", icon: GraduationCap },
  { to: "/kehadiran", label: "Kehadiran", icon: CalendarCheck },
  { to: "/keuangan", label: "Keuangan", icon: Wallet },
  { to: "/profil", label: "Profil", icon: UserCircle },
] as const;

const adminTabs = [
  { to: "/admin", label: "Dasbor", icon: LayoutDashboard },
  { to: "/admin/siswa", label: "Siswa", icon: UserCircle },
  { to: "/admin/mapel", label: "Mapel", icon: GraduationCap },
  { to: "/admin/kehadiran", label: "Kehadiran", icon: CalendarCheck },
  { to: "/admin/keuangan", label: "Keuangan", icon: Wallet },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const { isTeacher } = useSession();
  const location = useLocation();
  const tabs = isTeacher ? adminTabs : parentTabs;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5 sm:px-6">
        {children}
      </main>

      <nav
        data-ocid="nav.bottom"
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 shadow-elevated backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-3xl items-stretch justify-between px-2 pb-safe pt-1.5">
          {tabs.map((tab) => {
            const active =
              tab.to === "/"
                ? location.pathname === "/"
                : location.pathname === tab.to ||
                  location.pathname.startsWith(`${tab.to}/`);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                data-ocid={`nav.tab.${tab.label.toLowerCase()}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-medium transition-smooth",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("h-5 w-5", active && "text-primary")}
                  aria-hidden="true"
                />
                <span className="truncate">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
