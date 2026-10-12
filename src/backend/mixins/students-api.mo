import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Students "../types/students";
import StudentsLib "../lib/students";

mixin (
  accessControlState : AccessControl.AccessControlState,
  classes : Map.Map<Common.ClassId, Students.Class>,
  subjects : Map.Map<Common.SubjectId, Students.Subject>,
  students : Map.Map<Common.StudentId, Students.Student>,
  counters : {
    var nextClassId : Nat;
    var nextSubjectId : Nat;
    var nextStudentId : Nat;
  },
) {
  public query func listClasses() : async [Students.Class] {
    StudentsLib.listClasses(classes);
  };

  public shared ({ caller }) func addClass(name : Text) : async Students.Class {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    StudentsLib.addClass(classes, counters, name);
  };

  public shared ({ caller }) func updateClass(id : Common.ClassId, name : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    StudentsLib.updateClass(classes, id, name);
  };

  public shared ({ caller }) func deleteClass(id : Common.ClassId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    StudentsLib.deleteClass(classes, id);
  };

  public query func listSubjects() : async [Students.Subject] {
    StudentsLib.listSubjects(subjects);
  };

  public shared ({ caller }) func addSubject(name : Text) : async Students.Subject {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    StudentsLib.addSubject(subjects, counters, name);
  };

  public shared ({ caller }) func updateSubject(id : Common.SubjectId, name : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    StudentsLib.updateSubject(subjects, id, name);
  };

  public shared ({ caller }) func deleteSubject(id : Common.SubjectId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    StudentsLib.deleteSubject(subjects, id);
  };

  public query func listStudents() : async [Students.StudentView] {
    StudentsLib.listStudents(students, classes);
  };

  public query func getStudent(id : Common.StudentId) : async ?Students.StudentView {
    StudentsLib.getStudent(students, classes, id);
  };

  public shared ({ caller }) func addStudent(input : Students.StudentInput) : async Students.StudentView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    StudentsLib.addStudent(students, classes, counters, input);
  };

  public shared ({ caller }) func updateStudent(id : Common.StudentId, input : Students.StudentInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    StudentsLib.updateStudent(students, classes, id, input);
  };

  public shared ({ caller }) func deleteStudent(id : Common.StudentId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    StudentsLib.deleteStudent(students, id);
  };
};
