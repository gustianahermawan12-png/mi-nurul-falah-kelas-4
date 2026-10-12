import { AttendanceStatus, LeaveRequestStatus, Semester } from "@/backend";

export function formatRupiah(amount: bigint): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: bigint): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp / 1_000_000n));
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function semesterLabel(semester: Semester): string {
  return semester === Semester.semester1 ? "Semester 1" : "Semester 2";
}

export function attendanceLabel(status: AttendanceStatus): string {
  switch (status) {
    case AttendanceStatus.hadir:
      return "Hadir";
    case AttendanceStatus.izin:
      return "Izin";
    case AttendanceStatus.sakit:
      return "Sakit";
    case AttendanceStatus.alpa:
      return "Alpa";
  }
}

export function leaveStatusLabel(status: LeaveRequestStatus): string {
  switch (status) {
    case LeaveRequestStatus.menunggu:
      return "Menunggu";
    case LeaveRequestStatus.disetujui:
      return "Disetujui";
    case LeaveRequestStatus.ditolak:
      return "Ditolak";
  }
}

export function scoreToLetter(score: bigint): string {
  const value = Number(score);
  if (value >= 90) return "A";
  if (value >= 85) return "A-";
  if (value >= 80) return "B+";
  if (value >= 75) return "B";
  if (value >= 70) return "B-";
  if (value >= 60) return "C";
  return "D";
}

export function scoreTone(score: bigint): string {
  const value = Number(score);
  if (value >= 85) return "bg-primary text-primary-foreground";
  if (value >= 70) return "bg-accent text-accent-foreground";
  return "bg-destructive text-destructive-foreground";
}
