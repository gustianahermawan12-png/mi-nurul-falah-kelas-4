import { Semester } from "@/backend";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAttendanceSummary,
  useInfaqTotal,
  useOverallAverage,
  useSavings,
  useStudent,
  useSubjectSummaries,
} from "@/hooks/useQueries";
import { useSession } from "@/hooks/useSession";
import {
  formatNumber,
  formatRupiah,
  scoreToLetter,
  scoreTone,
  semesterLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, GraduationCap, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 rounded-xl bg-primary-foreground/10 px-2 py-2.5 text-center">
      <Icon className="h-4 w-4 text-primary-foreground/80" aria-hidden="true" />
      <span className="font-display text-sm font-semibold nums-tabular">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-primary-foreground/70">
        {label}
      </span>
    </div>
  );
}

export function DashboardPage() {
  const { session } = useSession();
  const studentId = session?.studentId;
  const [semester, setSemester] = useState<Semester>(Semester.semester1);

  const student = useStudent(studentId);
  const average = useOverallAverage(studentId);
  const attendance = useAttendanceSummary(studentId);
  const savings = useSavings(studentId);
  const infaqTotal = useInfaqTotal(studentId);
  const summaries = useSubjectSummaries(studentId, semester);

  const attendanceCounts = attendance.data
    ? {
        sakit: attendance.data.sakit,
        izin: attendance.data.izin,
        alpa: attendance.data.alpa,
      }
    : null;

  return (
    <div className="space-y-5">
      <Card
        data-ocid="dashboard.hero_card"
        className="overflow-hidden border-none bg-gradient-primary text-primary-foreground shadow-elevated"
      >
        <CardContent className="p-5">
          {student.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-12 rounded-full bg-primary-foreground/20" />
              <Skeleton className="h-5 w-40 bg-primary-foreground/20" />
              <Skeleton className="h-4 w-28 bg-primary-foreground/20" />
            </div>
          ) : student.data ? (
            <>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/15 font-display text-lg font-semibold">
                  {student.data.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-semibold">
                    {student.data.name}
                  </h2>
                  <p className="text-sm text-primary-foreground/80">
                    {student.data.className} · NISN {student.data.nisn}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatPill
                  icon={GraduationCap}
                  label="Rata-rata"
                  value={
                    average.data !== undefined
                      ? formatNumber(average.data)
                      : "—"
                  }
                />
                <StatPill
                  icon={CalendarCheck}
                  label="Sakit"
                  value={
                    attendanceCounts
                      ? formatNumber(attendanceCounts.sakit)
                      : "—"
                  }
                />
                <StatPill
                  icon={CalendarCheck}
                  label="Izin"
                  value={
                    attendanceCounts ? formatNumber(attendanceCounts.izin) : "—"
                  }
                />
                <StatPill
                  icon={CalendarCheck}
                  label="Alpa"
                  value={
                    attendanceCounts ? formatNumber(attendanceCounts.alpa) : "—"
                  }
                />
                <StatPill
                  icon={Wallet}
                  label="Tabungan"
                  value={
                    savings.data ? formatRupiah(savings.data.balance) : "—"
                  }
                />
              </div>
            </>
          ) : (
            <p className="text-sm">Data siswa tidak ditemukan.</p>
          )}
        </CardContent>
      </Card>

      <div
        role="tablist"
        aria-label="Pilih semester"
        className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
      >
        {[Semester.semester1, Semester.semester2].map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={semester === value}
            data-ocid={`dashboard.semester.tab.${value}`}
            onClick={() => setSemester(value)}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-smooth",
              semester === value
                ? "bg-card text-foreground shadow-subtle"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {semesterLabel(value)}
          </button>
        ))}
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">
            Ringkasan Nilai
          </h3>
          <Link
            to="/nilai"
            data-ocid="dashboard.grades.link"
            className="text-sm font-medium text-primary hover:underline"
          >
            Lihat semua
          </Link>
        </div>
        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {summaries.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from(
                  { length: 3 },
                  (_, i) => `summary-skeleton-${i}`,
                ).map((id) => (
                  <Skeleton key={id} className="h-9 w-full" />
                ))}
              </div>
            ) : summaries.data && summaries.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {summaries.data.map((summary) => (
                  <li
                    key={summary.subjectId.toString()}
                    data-ocid={`dashboard.subject.item.${summary.subjectId}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <span className="min-w-0 truncate text-sm font-medium">
                      {summary.subjectName}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-display text-sm font-semibold nums-tabular">
                        {formatNumber(summary.average)}
                      </span>
                      <span
                        className={cn(
                          "flex h-6 w-7 items-center justify-center rounded-md text-xs font-semibold",
                          scoreTone(summary.average),
                        )}
                      >
                        {scoreToLetter(summary.average)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                data-ocid="dashboard.grades.empty_state"
                className="px-4 py-8 text-center"
              >
                <TrendingUp
                  className="mx-auto h-6 w-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada nilai untuk {semesterLabel(semester)}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="mb-2 font-display text-base font-semibold">Keuangan</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border shadow-card">
            <CardContent className="p-4">
              <Wallet className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                Saldo Tabungan
              </p>
              <p className="mt-1 font-display text-base font-semibold nums-tabular">
                {savings.data ? formatRupiah(savings.data.balance) : "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-card">
            <CardContent className="p-4">
              <TrendingUp className="h-5 w-5 text-gold" aria-hidden="true" />
              <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                Total Infak
              </p>
              <p className="mt-1 font-display text-base font-semibold nums-tabular">
                {infaqTotal.data !== undefined
                  ? formatRupiah(infaqTotal.data)
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
