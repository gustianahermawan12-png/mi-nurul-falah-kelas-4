import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllLeaveRequests,
  useClasses,
  useStudents,
  useSubjects,
} from "@/hooks/useQueries";
import { formatDate, leaveStatusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  GraduationCap,
  TrendingUp,
  UserCircle,
} from "lucide-react";

export function AdminDashboard() {
  const students = useStudents();
  const classes = useClasses();
  const subjects = useSubjects();
  const leaveRequests = useAllLeaveRequests();

  const pending =
    leaveRequests.data?.filter((r) => r.requestStatus === "menunggu") ?? [];

  const cards = [
    {
      to: "/admin/siswa",
      label: "Siswa",
      value: students.data?.length,
      icon: UserCircle,
      loading: students.isLoading,
    },
    {
      to: "/admin/mapel",
      label: "Mapel & Nilai",
      value: subjects.data?.length,
      icon: GraduationCap,
      loading: subjects.isLoading,
    },
    {
      to: "/admin/kehadiran",
      label: "Izin Menunggu",
      value: pending.length,
      icon: CalendarCheck,
      loading: leaveRequests.isLoading,
    },
    {
      to: "/admin/keuangan",
      label: "Kelas",
      value: classes.data?.length,
      icon: TrendingUp,
      loading: classes.isLoading,
    },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Panel Guru
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Kelola data akademik dan keuangan
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              data-ocid={`admin.card.${card.label.toLowerCase().replace(/\s+/g, "_")}`}
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full border-border shadow-card transition-smooth hover:shadow-elevated">
                <CardContent className="p-4">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  {card.loading ? (
                    <Skeleton className="mt-3 h-7 w-10" />
                  ) : (
                    <p className="mt-2 font-display text-2xl font-semibold nums-tabular">
                      {card.value ?? 0}
                    </p>
                  )}
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {card.label}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <section>
        <h2 className="mb-2 font-display text-base font-semibold">
          Pengajuan Izin Terbaru
        </h2>
        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {leaveRequests.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from(
                  { length: 3 },
                  (_, i) => `admin-leave-skeleton-${i}`,
                ).map((id) => (
                  <Skeleton key={id} className="h-10 w-full" />
                ))}
              </div>
            ) : leaveRequests.data && leaveRequests.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {leaveRequests.data.slice(0, 5).map((request) => (
                  <li
                    key={request.id.toString()}
                    data-ocid={`admin.leave.item.${request.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {formatDate(request.date)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {request.reason}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-md px-2 py-1 text-xs font-semibold",
                        request.requestStatus === "disetujui" &&
                          "bg-primary/15 text-primary",
                        request.requestStatus === "ditolak" &&
                          "bg-destructive/15 text-destructive",
                        request.requestStatus === "menunggu" &&
                          "bg-gold/20 text-gold-foreground",
                      )}
                    >
                      {leaveStatusLabel(request.requestStatus)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                data-ocid="admin.leave.empty_state"
                className="px-4 py-8 text-center"
              >
                <CalendarCheck
                  className="mx-auto h-6 w-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada pengajuan izin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
