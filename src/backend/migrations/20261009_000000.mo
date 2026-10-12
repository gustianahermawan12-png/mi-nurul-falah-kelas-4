import Map "mo:core/Map";
import Nat "mo:core/Nat";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type Class = { id : Nat; name : Text };
  type Subject = { id : Nat; name : Text };
  type Student = {
    id : Nat;
    nisn : Text;
    name : Text;
    classId : Nat;
    isActive : Bool;
    parentPhone : Text;
    parentPassword : Text;
  };
  type Semester = { #semester1; #semester2 };
  type GradeCategory = { id : Nat; name : Text; semester : Semester };
  type Grade = { id : Nat; studentId : Nat; subjectId : Nat; categoryId : Nat; score : Nat };
  type AttendanceStatus = { #sakit; #izin; #alpa; #hadir };
  type AttendanceRecord = { id : Nat; studentId : Nat; date : Text; status : AttendanceStatus; note : Text };
  type LeaveRequestStatus = { #menunggu; #disetujui; #ditolak };
  type LeaveRequest = {
    id : Nat;
    studentId : Nat;
    date : Text;
    status : AttendanceStatus;
    reason : Text;
    proof : ?Blob;
    requestStatus : LeaveRequestStatus;
    teacherNote : Text;
    createdAt : Nat;
  };
  type SavingsDirection = { #masuk; #keluar };
  type SavingsTransaction = { id : Nat; studentId : Nat; direction : SavingsDirection; amount : Nat; date : Text; note : Text };
  type InfaqTransaction = { id : Nat; studentId : Nat; amount : Nat; date : Text; note : Text };
  type UserKind = { #guru; #orangTua };
  type Session = { token : Text; kind : UserKind; studentId : ?Nat; createdAt : Nat };
  type TeacherCredentials = { username : Text; password : Text };

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    classes : Map.Map<Nat, Class>;
    subjects : Map.Map<Nat, Subject>;
    students : Map.Map<Nat, Student>;
    gradeCategories : Map.Map<Nat, GradeCategory>;
    grades : Map.Map<Nat, Grade>;
    attendance : Map.Map<Nat, AttendanceRecord>;
    leaveRequests : Map.Map<Nat, LeaveRequest>;
    savings : Map.Map<Nat, SavingsTransaction>;
    infaq : Map.Map<Nat, InfaqTransaction>;
    sessions : Map.Map<Text, Session>;
    teacherCredentials : TeacherCredentials;
    counters : {
      var nextClassId : Nat;
      var nextSubjectId : Nat;
      var nextStudentId : Nat;
      var nextCategoryId : Nat;
      var nextGradeId : Nat;
      var nextAttendanceId : Nat;
      var nextLeaveRequestId : Nat;
      var nextSavingsId : Nat;
      var nextInfaqId : Nat;
    };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      classes = Map.empty();
      subjects = Map.empty();
      students = Map.empty();
      gradeCategories = Map.empty();
      grades = Map.empty();
      attendance = Map.empty();
      leaveRequests = Map.empty();
      savings = Map.empty();
      infaq = Map.empty();
      sessions = Map.empty();
      teacherCredentials = { username = "guru"; password = "guru123" };
      counters = {
        var nextClassId = 0;
        var nextSubjectId = 0;
        var nextStudentId = 0;
        var nextCategoryId = 0;
        var nextGradeId = 0;
        var nextAttendanceId = 0;
        var nextLeaveRequestId = 0;
        var nextSavingsId = 0;
        var nextInfaqId = 0;
      };
    };
  };
};
