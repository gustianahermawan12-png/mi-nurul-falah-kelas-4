module {
  public type Timestamp = Nat;
  public type StudentId = Nat;
  public type ClassId = Nat;
  public type SubjectId = Nat;
  public type CategoryId = Nat;
  public type AttendanceId = Nat;
  public type LeaveRequestId = Nat;
  public type SavingsId = Nat;
  public type InfaqId = Nat;
  public type Semester = { #semester1; #semester2 };
  public type AttendanceStatus = { #sakit; #izin; #alpa; #hadir };
  public type LeaveRequestStatus = { #menunggu; #disetujui; #ditolak };
  public type SavingsDirection = { #masuk; #keluar };
};
