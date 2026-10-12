import Map "mo:core/Map";
import Nat "mo:core/Nat";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import SemesterValue "types/SemesterValue";
import AttendanceStatusValue "types/AttendanceStatusValue";
import LeaveRequestStatusValue "types/LeaveRequestStatusValue";
import SavingsDirectionValue "types/SavingsDirectionValue";
import OptionalBlobValue "types/OptionalBlobValue";
import Common "types/common";
import Students "types/students";
import Grades "types/grades";
import Attendance "types/attendance";
import Finance "types/finance";
import Auth "types/auth";
import StudentsApi "mixins/students-api";
import GradesApi "mixins/grades-api";
import AttendanceApi "mixins/attendance-api";
import FinanceApi "mixins/finance-api";
import AuthApi "mixins/auth-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);
  include MixinObjectStorage();

  let classes : Map.Map<Common.ClassId, Students.Class>;
  let subjects : Map.Map<Common.SubjectId, Students.Subject>;
  let students : Map.Map<Common.StudentId, Students.Student>;
  let gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>;
  let grades : Map.Map<Nat, Grades.Grade>;
  let attendance : Map.Map<Common.AttendanceId, Attendance.AttendanceRecord>;
  let leaveRequests : Map.Map<Common.LeaveRequestId, Attendance.LeaveRequest>;
  let savings : Map.Map<Common.SavingsId, Finance.SavingsTransaction>;
  let infaq : Map.Map<Common.InfaqId, Finance.InfaqTransaction>;
  let sessions : Map.Map<Text, Auth.Session>;
  let teacherCredentials : Auth.TeacherCredentials;
  let counters : {
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

  include StudentsApi(accessControlState, classes, subjects, students, counters);
  include GradesApi(accessControlState, subjects, gradeCategories, grades, counters);
  include AttendanceApi(accessControlState, attendance, leaveRequests, counters);
  include FinanceApi(accessControlState, savings, infaq, counters);
  include AuthApi(accessControlState, sessions, teacherCredentials, students);
  include ApiDocMixin();

  include Expose({
    entities = [
      classes.toEntity("class", "Class", "id")
        .sample({ id = 0; name = "" })
        .controllerOnly()
        .build(),
      subjects.toEntity("subject", "Subject", "id")
        .sample({ id = 0; name = "" })
        .controllerOnly()
        .build(),
      students.toEntity("student", "Student", "id")
        .sample({ id = 0; nisn = ""; name = ""; classId = 0; isActive = true; parentPhone = ""; parentPassword = "" })
        .hidden("parentPassword")
        .controllerOnly()
        .build(),
      gradeCategories.toEntity("gradeCategory", "GradeCategory", "id")
        .sample({ id = 0; name = ""; semester = #semester1 })
        .controllerOnly()
        .build(),
      grades.toEntity("grade", "Grade", "id")
        .sample({ id = 0; studentId = 0; subjectId = 0; categoryId = 0; score = 0 })
        .controllerOnly()
        .build(),
      attendance.toEntity("attendance", "AttendanceRecord", "id")
        .sample({ id = 0; studentId = 0; date = ""; status = #hadir; note = "" })
        .controllerOnly()
        .build(),
      leaveRequests.toEntity("leaveRequest", "LeaveRequest", "id")
        .sample({ id = 0; studentId = 0; date = ""; status = #izin; reason = ""; proof = ?"".encodeUtf8(); requestStatus = #menunggu; teacherNote = ""; createdAt = 0 })
        .hidden("proof")
        .controllerOnly()
        .build(),
      savings.toEntity("savings", "SavingsTransaction", "id")
        .sample({ id = 0; studentId = 0; direction = #masuk; amount = 0; date = ""; note = "" })
        .controllerOnly()
        .build(),
      infaq.toEntity("infaq", "InfaqTransaction", "id")
        .sample({ id = 0; studentId = 0; amount = 0; date = ""; note = "" })
        .controllerOnly()
        .build(),
    ];
  });
};
