import { AttendanceStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAttendance,
  useAttendanceSummary,
  useCreateLeaveRequest,
  useLeaveRequests,
} from "@/hooks/useQueries";
import { useSession } from "@/hooks/useSession";
import {
  attendanceLabel,
  formatDate,
  formatNumber,
  leaveStatusLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { ExternalBlob } from "@caffeineai/object-storage";
import {
  CalendarCheck,
  FileText,
  ImagePlus,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

const statusTone: Record<string, string> = {
  Hadir: "bg-primary text-primary-foreground",
  Izin: "bg-gold text-gold-foreground",
  Sakit: "bg-accent text-accent-foreground",
  Alpa: "bg-destructive text-destructive-foreground",
};

const leaveTypeOptions = [
  { value: AttendanceStatus.izin, label: "Izin" },
  { value: AttendanceStatus.sakit, label: "Sakit" },
  { value: AttendanceStatus.alpa, label: "Alpa" },
] as const;

const statusBadgeTone: Record<string, string> = {
  disetujui: "bg-primary/15 text-primary",
  ditolak: "bg-destructive/15 text-destructive",
  menunggu: "bg-gold/20 text-gold-foreground",
};

export function AttendancePage() {
  const { session } = useSession();
  const studentId = session?.studentId;
  const summary = useAttendanceSummary(studentId);
  const records = useAttendance(studentId);
  const leaveRequests = useLeaveRequests(studentId);
  const createLeave = useCreateLeaveRequest();

  const [formOpen, setFormOpen] = useState(false);
  const [date, setDate] = useState("");
  const [leaveType, setLeaveType] = useState<AttendanceStatus>(
    AttendanceStatus.izin,
  );
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState<ExternalBlob | null>(null);
  const [proofName, setProofName] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const total =
    summary.data !== undefined && summary.data !== null
      ? summary.data.hadir +
        summary.data.alpa +
        summary.data.izin +
        summary.data.sakit
      : 0n;

  const stats = summary.data
    ? [
        { label: "Hadir", value: summary.data.hadir, tone: "text-primary" },
        { label: "Izin", value: summary.data.izin, tone: "text-gold" },
        { label: "Sakit", value: summary.data.sakit, tone: "text-accent" },
        { label: "Alpa", value: summary.data.alpa, tone: "text-destructive" },
      ]
    : [];

  const resetForm = () => {
    setDate("");
    setLeaveType(AttendanceStatus.izin);
    setReason("");
    setProof(null);
    setProofName("");
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(
      bytes,
      file.type,
      file.name,
    ).withUploadProgress((pct) => setUploadProgress(pct));
    setProof(blob);
    setProofName(file.name);
    setUploadProgress(100);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentId || !date || !reason.trim()) return;
    const captured = {
      status: leaveType,
      studentId,
      date,
      reason: reason.trim(),
      ...(proof ? { proof } : {}),
    };
    resetForm();
    setFormOpen(false);
    createLeave.mutate(captured, {
      onError: () => setFormOpen(true),
    });
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Kehadiran
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Rekap absensi dan pengajuan izin
        </p>
      </header>

      <Card className="border-border shadow-card">
        <CardContent className="p-4">
          {summary.isLoading ? (
            <div className="grid grid-cols-4 gap-2">
              {Array.from(
                { length: 4 },
                (_, i) => `attendance-skeleton-${i}`,
              ).map((id) => (
                <Skeleton key={id} className="h-16 w-full" />
              ))}
            </div>
          ) : summary.data ? (
            <div className="grid grid-cols-4 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  data-ocid={`attendance.stat.${stat.label.toLowerCase()}`}
                  className="rounded-lg bg-muted px-2 py-3 text-center"
                >
                  <p
                    className={cn(
                      "font-display text-lg font-semibold nums-tabular",
                      stat.tone,
                    )}
                  >
                    {formatNumber(stat.value)}
                  </p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Rekap belum tersedia.
            </p>
          )}
          {total > 0n ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Total {formatNumber(total)} hari tercatat
            </p>
          ) : null}
        </CardContent>
      </Card>

      <section>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold">
            Pengajuan Izin
          </h2>
          <Button
            type="button"
            size="sm"
            data-ocid="attendance.open_modal_button"
            onClick={() => setFormOpen((open) => !open)}
          >
            {formOpen ? (
              <X className="mr-1 h-4 w-4" aria-hidden="true" />
            ) : (
              <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
            )}
            Buat Keterangan Absen
          </Button>
        </div>

        {formOpen ? (
          <Card
            data-ocid="attendance.modal"
            className="mb-3 border-border shadow-card"
          >
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="leave-date">Tanggal</Label>
                  <Input
                    id="leave-date"
                    type="date"
                    data-ocid="attendance.input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <fieldset className="space-y-1.5">
                  <legend className="text-sm font-medium">Jenis</legend>
                  <div className="flex gap-2">
                    {leaveTypeOptions.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition-smooth",
                          leaveType === option.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input text-muted-foreground hover:border-primary/50",
                        )}
                      >
                        <input
                          type="radio"
                          name="leave-type"
                          className="sr-only"
                          data-ocid={`attendance.radio.${option.value}`}
                          checked={leaveType === option.value}
                          onChange={() => setLeaveType(option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="space-y-1.5">
                  <Label htmlFor="leave-reason">Alasan</Label>
                  <Textarea
                    id="leave-reason"
                    data-ocid="attendance.textarea"
                    placeholder="Jelaskan alasan ketidakhadiran"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="leave-proof">Bukti Foto</Label>
                  <input
                    id="leave-proof"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    data-ocid="attendance.upload_button"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="mr-2 h-4 w-4" aria-hidden="true" />
                    {proofName || "Pilih foto bukti"}
                  </Button>
                  {uploadProgress !== null ? (
                    <div
                      data-ocid="attendance.upload.progress"
                      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-smooth"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  ) : null}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    data-ocid="attendance.submit_button"
                    disabled={createLeave.isPending || !date || !reason.trim()}
                    className="flex-1"
                  >
                    {createLeave.isPending ? (
                      <Loader2
                        className="mr-1 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : null}
                    Kirim Pengajuan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="attendance.cancel_button"
                    onClick={() => {
                      resetForm();
                      setFormOpen(false);
                    }}
                  >
                    Batal
                  </Button>
                </div>
                {createLeave.isError ? (
                  <p
                    data-ocid="attendance.error_state"
                    className="text-sm text-destructive"
                  >
                    Pengajuan gagal dikirim. Coba lagi.
                  </p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {leaveRequests.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 2 }, (_, i) => `leave-skeleton-${i}`).map(
                  (id) => (
                    <Skeleton key={id} className="h-12 w-full" />
                  ),
                )}
              </div>
            ) : leaveRequests.data && leaveRequests.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {leaveRequests.data.map((request) => (
                  <li
                    key={request.id.toString()}
                    data-ocid={`attendance.leave.item.${request.id}`}
                    className="px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">
                        {formatDate(request.date)}
                      </p>
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
                    <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <FileText
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">{request.reason}</span>
                    </p>
                    {request.proof ? (
                      <img
                        src={request.proof.getDirectURL()}
                        alt={`Bukti ${request.reason}`}
                        data-ocid={`attendance.leave.proof.${request.id}`}
                        className="mt-2 h-24 w-24 rounded-lg border border-border object-cover"
                      />
                    ) : null}
                    {request.teacherNote ? (
                      <p className="mt-1 text-xs text-foreground">
                        Catatan guru: {request.teacherNote}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div
                data-ocid="attendance.leave.empty_state"
                className="px-4 py-8 text-center"
              >
                <FileText
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

      <section>
        <h2 className="mb-2 font-display text-base font-semibold">
          Riwayat Absensi
        </h2>
        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {records.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from(
                  { length: 4 },
                  (_, i) => `record-skeleton-${i}`,
                ).map((id) => (
                  <Skeleton key={id} className="h-9 w-full" />
                ))}
              </div>
            ) : records.data && records.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {records.data.map((record) => (
                  <li
                    key={record.id.toString()}
                    data-ocid={`attendance.record.item.${record.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {formatDate(record.date)}
                      </p>
                      {record.note ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {record.note}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "rounded-md px-2 py-1 text-xs font-semibold",
                        statusTone[attendanceLabel(record.status)],
                      )}
                    >
                      {attendanceLabel(record.status)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                data-ocid="attendance.empty_state"
                className="px-4 py-8 text-center"
              >
                <CalendarCheck
                  className="mx-auto h-6 w-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada catatan kehadiran.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
