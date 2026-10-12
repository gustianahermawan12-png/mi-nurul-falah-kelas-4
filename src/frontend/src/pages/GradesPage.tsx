import { Semester } from "@/backend";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubjectSummaries } from "@/hooks/useQueries";
import { useSession } from "@/hooks/useSession";
import {
  formatNumber,
  scoreToLetter,
  scoreTone,
  semesterLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

export function GradesPage() {
  const { session } = useSession();
  const studentId = session?.studentId;
  const [semester, setSemester] = useState<Semester>(Semester.semester1);
  const summaries = useSubjectSummaries(studentId, semester);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Nilai
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Rapor per mata pelajaran
        </p>
      </header>

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
            data-ocid={`grades.semester.tab.${value}`}
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

      {summaries.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => `grades-skeleton-${i}`).map(
            (id) => (
              <Skeleton key={id} className="h-28 w-full rounded-lg" />
            ),
          )}
        </div>
      ) : summaries.data && summaries.data.length > 0 ? (
        <div className="space-y-3">
          {summaries.data.map((summary) => (
            <Card
              key={summary.subjectId.toString()}
              data-ocid={`grades.subject.card.${summary.subjectId}`}
              className="border-border shadow-card"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="min-w-0 truncate font-display text-base font-semibold">
                    {summary.subjectName}
                  </h2>
                  <span className="flex items-center gap-2">
                    <span className="font-display text-lg font-semibold nums-tabular">
                      {formatNumber(summary.average)}
                    </span>
                    <span
                      className={cn(
                        "flex h-7 w-8 items-center justify-center rounded-md text-sm font-semibold",
                        scoreTone(summary.average),
                      )}
                    >
                      {scoreToLetter(summary.average)}
                    </span>
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                  {summary.components.map((component) => (
                    <li
                      key={component.id.toString()}
                      data-ocid={`grades.component.item.${component.id}`}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="min-w-0 truncate text-muted-foreground">
                        {component.categoryName}
                      </span>
                      <span className="font-medium nums-tabular">
                        {formatNumber(component.score)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-border shadow-none">
          <CardContent
            data-ocid="grades.empty_state"
            className="flex flex-col items-center px-4 py-10 text-center"
          >
            <GraduationCap
              className="h-7 w-7 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-medium">Belum ada nilai</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nilai untuk {semesterLabel(semester)} belum diinput oleh guru.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
