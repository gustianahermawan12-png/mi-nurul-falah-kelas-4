import { AttendanceStatus, LeaveRequestStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllLeaveRequests,
  useAttendance,
  useDeleteAttendance,
  useReviewLeaveRequest,
  useSetAttendance,
  useStudents,
} from "@/hooks/useQueries";
import {
  attendanceLabel,
  formatDate,
  formatDateTime,
  leaveStatusLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { CalendarCheck, Check, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";

const statusBadgeTone: Record<string, string> = {
  disetujui: "bg-primary/15 text-primary",
  ditolak: "bg-destructive/15 text-destructive",
  menunggu: "bg-gold/20 text-gold-foreground",
};

const attendanceTone: Record<string, string> = {
  hadir: "bg-primary/15 text-primary",
  izin: "bg-gold/20 text-gold-foreground",
  sakit: "bg-gold/20 text-gold-foreground",
  alpa: "bg-destructive/15 text-destructive",
};

export function AdminLeave() {
  const leaveRequests = useAllLeaveRequests();
  const review = useReviewLeaveRequest();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const students = useStudents();
  const setAttendance = useSetAttendance();
  const deleteAttendance = useDeleteAttendance();
  const [attStudentId, setAttStudentId] = useState("");
  const [attDate, setAttDate] = useState("");
  const [attStatus, setAttStatus] = useState<AttendanceStatus>(
    AttendanceStatus.hadir,
  );
  const [attNote, setAttNote] = useState("");
  const [attError, setAttError] = useState<string | null>(null);

  const selectedStudentId = attStudentId ? BigInt(attStudentId) : undefined;
  const attendance = useAttendance(selectedStudentId);

  const handleSetAttendance = (event: React.FormEvent) => {
    event.preventDefault();
    setAttError(null);
    if (!selectedStudentId || !attDate) {
      setAttError("Pilih siswa dan tanggal.");
      return;
    }
    setAttendance.mutate(
      {
        studentId: selectedStudentId,
        date: attDate,
        status: attStatus,
        note: attNote,
      },
      {
        onSuccess: () => {
          setAttDate("");
          setAttNote("");
        },
        onError: (err) => setAttError(err.message),
      },
    );
  };

  const handleReview = (id: bigint, status: LeaveRequestStatus) => {
    review.mutate({ id, status, teacherNote: notes[id.toString()] ?? "" });
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Kehadiran & Izin
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Catat kehadiran harian dan tinjau pengajuan izin
        </p>
      </header>

      <section>
        <h2 className="mb-2 font-display text-base font-semibold">
          Kehadiran Harian
        </h2>
        <Card className="border-border shadow-card">
          <CardContent className="space-y-3 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="attendance-student">Siswa</Label>
              <Select value={attStudentId} onValueChange={setAttStudentId}>
                <SelectTrigger
                  id="attendance-student"
                  data-ocid="admin.attendance.select.student"
                >
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.data?.map((student) => (
                    <SelectItem
                      key={student.id.toString()}
                      value={student.id.toString()}
                    >
                      {student.name} · {student.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStudentId ? (
              <>
                <form onSubmit={handleSetAttendance} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="attendance-date">Tanggal</Label>
                      <Input
                        id="attendance-date"
                        type="date"
                        data-ocid="admin.attendance.input.date"
                        value={attDate}
                        onChange={(e) => setAttDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="attendance-status">Status</Label>
                      <Select
                        value={attStatus}
                        onValueChange={(value) =>
                          setAttStatus(value as AttendanceStatus)
                        }
                      >
                        <SelectTrigger
                          id="attendance-status"
                          data-ocid="admin.attendance.select.status"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AttendanceStatus.hadir}>
                            Hadir
                          </SelectItem>
                          <SelectItem value={AttendanceStatus.izin}>
                            Izin
                          </SelectItem>
                          <SelectItem value={AttendanceStatus.sakit}>
                            Sakit
                          </SelectItem>
                          <SelectItem value={AttendanceStatus.alpa}>
                            Alpa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="attendance-note">Catatan</Label>
                    <Input
                      id="attendance-note"
                      data-ocid="admin.attendance.input.note"
                      value={attNote}
                      onChange={(e) => setAttNote(e.target.value)}
                    />
                  </div>
                  {attError ? (
                    <p
                      data-ocid="admin.attendance.error_state"
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      {attError}
                    </p>
                  ) : null}
                  <Button
                    type="submit"
                    data-ocid="admin.attendance.submit_button"
                    disabled={setAttendance.isPending}
                  >
                    {setAttendance.isPending ? (
                      <Loader2
                        className="mr-1 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : null}
                    Simpan Kehadiran
                  </Button>
                </form>

                {attendance.isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : attendance.data && attendance.data.length > 0 ? (
                  <ul className="divide-y divide-border border-t border-border">
                    {attendance.data.map((record) => (
                      <li
                        key={record.id.toString()}
                        data-ocid={`admin.attendance.item.${record.id}`}
                        className="flex items-center justify-between gap-3 py-2 text-sm"
                      >
                        <span className="min-w-0 truncate text-muted-foreground">
                          {formatDate(record.date)}
                          {record.note ? ` · ${record.note}` : ""}
                        </span>
                        <span className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "border-none",
                              attendanceTone[record.status],
                            )}
                          >
                            {attendanceLabel(record.status)}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            data-ocid={`admin.attendance.delete_button.${record.id}`}
                            aria-label={`Hapus kehadiran ${formatDate(record.date)}`}
                            disabled={deleteAttendance.isPending}
                            onClick={() => deleteAttendance.mutate(record.id)}
                          >
                            <Trash2
                              className="h-4 w-4 text-destructive"
                              aria-hidden="true"
                            />
                          </Button>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    data-ocid="admin.attendance.empty_state"
                    className="border-t border-border pt-3 text-sm text-muted-foreground"
                  >
                    Belum ada catatan kehadiran.
                  </p>
                )}
              </>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-2 font-display text-base font-semibold">
          Pengajuan Izin
        </h2>
      </section>

      {leaveRequests.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => `leave-admin-skeleton-${i}`).map(
            (id) => (
              <Skeleton key={id} className="h-32 w-full rounded-lg" />
            ),
          )}
        </div>
      ) : leaveRequests.data && leaveRequests.data.length > 0 ? (
        <ul className="space-y-3">
          {leaveRequests.data.map((request) => (
            <li key={request.id.toString()}>
              <Card
                data-ocid={`admin.leave.card.${request.id}`}
                className="border-border shadow-card"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {formatDate(request.date)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Diajukan {formatDateTime(request.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-none",
                        statusBadgeTone[request.requestStatus],
                      )}
                    >
                      {leaveStatusLabel(request.requestStatus)}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm">{request.reason}</p>

                  {request.proof ? (
                    <a
                      href={request.proof.getDirectURL()}
                      target="_blank"
                      rel="noreferrer"
                      data-ocid={`admin.leave.proof.${request.id}`}
                      className="mt-3 block w-fit"
                    >
                      <img
                        src={request.proof.getDirectURL()}
                        alt={`Bukti ${request.reason}`}
                        className="h-28 w-28 rounded-lg border border-border object-cover transition-smooth hover:opacity-90"
                      />
                    </a>
                  ) : null}

                  {request.requestStatus === "menunggu" ? (
                    <div className="mt-3 space-y-2 border-t border-border pt-3">
                      <Textarea
                        data-ocid={`admin.leave.textarea.${request.id}`}
                        placeholder="Catatan guru (opsional)"
                        rows={2}
                        value={notes[request.id.toString()] ?? ""}
                        onChange={(e) =>
                          setNotes((current) => ({
                            ...current,
                            [request.id.toString()]: e.target.value,
                          }))
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          data-ocid={`admin.leave.confirm_button.${request.id}`}
                          disabled={review.isPending}
                          onClick={() =>
                            handleReview(
                              request.id,
                              LeaveRequestStatus.disetujui,
                            )
                          }
                        >
                          {review.isPending ? (
                            <Loader2
                              className="mr-1 h-4 w-4 animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <Check
                              className="mr-1 h-4 w-4"
                              aria-hidden="true"
                            />
                          )}
                          Setujui
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          data-ocid={`admin.leave.cancel_button.${request.id}`}
                          disabled={review.isPending}
                          onClick={() =>
                            handleReview(request.id, LeaveRequestStatus.ditolak)
                          }
                        >
                          <X className="mr-1 h-4 w-4" aria-hidden="true" />
                          Tolak
                        </Button>
                      </div>
                    </div>
                  ) : request.teacherNote ? (
                    <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                      Catatan: {request.teacherNote}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="border-dashed border-border shadow-none">
          <CardContent
            data-ocid="admin.leave.empty_state"
            className="flex flex-col items-center px-4 py-10 text-center"
          >
            <CalendarCheck
              className="h-7 w-7 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-medium">Belum ada pengajuan</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pengajuan izin dari orang tua akan muncul di sini.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
