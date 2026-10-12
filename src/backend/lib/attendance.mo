import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Common "../types/common";
import Attendance "../types/attendance";

module {
  public func listAttendance(attendance : Map.Map<Common.AttendanceId, Attendance.AttendanceRecord>, studentId : Common.StudentId) : [Attendance.AttendanceRecord] {
    attendance.values().toArray().filter(func a = a.studentId == studentId);
  };

  public func getAttendanceSummary(attendance : Map.Map<Common.AttendanceId, Attendance.AttendanceRecord>, studentId : Common.StudentId) : Attendance.AttendanceSummary {
    let records = listAttendance(attendance, studentId);
    {
      sakit = records.filter(func a = a.status == #sakit).size();
      izin = records.filter(func a = a.status == #izin).size();
      alpa = records.filter(func a = a.status == #alpa).size();
      hadir = records.filter(func a = a.status == #hadir).size();
    };
  };

  public func setAttendance(attendance : Map.Map<Common.AttendanceId, Attendance.AttendanceRecord>, counters : { var nextAttendanceId : Nat }, studentId : Common.StudentId, date : Text, status : Common.AttendanceStatus, note : Text) : Attendance.AttendanceRecord {
    let existing = attendance.values().toArray().find(func a = a.studentId == studentId and a.date == date);
    let id = switch (existing) {
      case (?a) { a.id };
      case null {
        let newId = counters.nextAttendanceId;
        counters.nextAttendanceId += 1;
        newId;
      };
    };
    let entry : Attendance.AttendanceRecord = { id; studentId; date; status; note };
    attendance.add(id, entry);
    entry;
  };

  public func deleteAttendance(attendance : Map.Map<Common.AttendanceId, Attendance.AttendanceRecord>, id : Common.AttendanceId) : () {
    attendance.remove(id);
  };

  public func listLeaveRequests(leaveRequests : Map.Map<Common.LeaveRequestId, Attendance.LeaveRequest>, studentId : Common.StudentId) : [Attendance.LeaveRequest] {
    leaveRequests.values().toArray().filter(func l = l.studentId == studentId);
  };

  public func listAllLeaveRequests(leaveRequests : Map.Map<Common.LeaveRequestId, Attendance.LeaveRequest>) : [Attendance.LeaveRequest] {
    leaveRequests.values().toArray();
  };

  public func createLeaveRequest(leaveRequests : Map.Map<Common.LeaveRequestId, Attendance.LeaveRequest>, counters : { var nextLeaveRequestId : Nat }, input : Attendance.LeaveRequestInput) : Attendance.LeaveRequest {
    let id = counters.nextLeaveRequestId;
    counters.nextLeaveRequestId += 1;
    let entry : Attendance.LeaveRequest = {
      id;
      studentId = input.studentId;
      date = input.date;
      status = input.status;
      reason = input.reason;
      proof = input.proof;
      requestStatus = #menunggu;
      teacherNote = "";
      createdAt = Time.now().toNat();
    };
    leaveRequests.add(id, entry);
    entry;
  };

  public func reviewLeaveRequest(leaveRequests : Map.Map<Common.LeaveRequestId, Attendance.LeaveRequest>, id : Common.LeaveRequestId, status : Common.LeaveRequestStatus, teacherNote : Text) : () {
    switch (leaveRequests.get(id)) {
      case (?existing) {
        leaveRequests.add(id, {
          id = existing.id;
          studentId = existing.studentId;
          date = existing.date;
          status = existing.status;
          reason = existing.reason;
          proof = existing.proof;
          requestStatus = status;
          teacherNote;
          createdAt = existing.createdAt;
        });
      };
      case null {};
    };
  };
};
