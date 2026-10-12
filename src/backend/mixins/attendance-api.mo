import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Attendance "../types/attendance";
import AttendanceLib "../lib/attendance";

mixin (
  accessControlState : AccessControl.AccessControlState,
  attendance : Map.Map<Common.AttendanceId, Attendance.AttendanceRecord>,
  leaveRequests : Map.Map<Common.LeaveRequestId, Attendance.LeaveRequest>,
  counters : {
    var nextAttendanceId : Nat;
    var nextLeaveRequestId : Nat;
  },
) {
  public query func listAttendance(studentId : Common.StudentId) : async [Attendance.AttendanceRecord] {
    AttendanceLib.listAttendance(attendance, studentId);
  };

  public query func getAttendanceSummary(studentId : Common.StudentId) : async Attendance.AttendanceSummary {
    AttendanceLib.getAttendanceSummary(attendance, studentId);
  };

  public shared ({ caller }) func setAttendance(studentId : Common.StudentId, date : Text, status : Common.AttendanceStatus, note : Text) : async Attendance.AttendanceRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    AttendanceLib.setAttendance(attendance, counters, studentId, date, status, note);
  };

  public shared ({ caller }) func deleteAttendance(id : Common.AttendanceId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    AttendanceLib.deleteAttendance(attendance, id);
  };

  public query func listLeaveRequests(studentId : Common.StudentId) : async [Attendance.LeaveRequest] {
    AttendanceLib.listLeaveRequests(leaveRequests, studentId);
  };

  public query func listAllLeaveRequests() : async [Attendance.LeaveRequest] {
    AttendanceLib.listAllLeaveRequests(leaveRequests);
  };

  public shared ({ caller }) func createLeaveRequest(input : Attendance.LeaveRequestInput) : async Attendance.LeaveRequest {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: hanya pengguna terdaftar yang dapat mengirim pengajuan");
    };
    AttendanceLib.createLeaveRequest(leaveRequests, counters, input);
  };

  public shared ({ caller }) func reviewLeaveRequest(id : Common.LeaveRequestId, status : Common.LeaveRequestStatus, teacherNote : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    AttendanceLib.reviewLeaveRequest(leaveRequests, id, status, teacherNote);
  };
};
