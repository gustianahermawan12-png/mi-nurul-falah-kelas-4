import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type AttendanceRecord = {
    id : Common.AttendanceId;
    studentId : Common.StudentId;
    date : Text;
    status : Common.AttendanceStatus;
    note : Text;
  };

  public type AttendanceSummary = {
    sakit : Nat;
    izin : Nat;
    alpa : Nat;
    hadir : Nat;
  };

  public type LeaveRequest = {
    id : Common.LeaveRequestId;
    studentId : Common.StudentId;
    date : Text;
    status : Common.AttendanceStatus;
    reason : Text;
    proof : ?Storage.ExternalBlob;
    requestStatus : Common.LeaveRequestStatus;
    teacherNote : Text;
    createdAt : Common.Timestamp;
  };

  public type LeaveRequestInput = {
    studentId : Common.StudentId;
    date : Text;
    status : Common.AttendanceStatus;
    reason : Text;
    proof : ?Storage.ExternalBlob;
  };
};
