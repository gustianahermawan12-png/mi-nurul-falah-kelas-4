import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Students "../types/students";
import Grades "../types/grades";
import GradesLib "../lib/grades";

mixin (
  accessControlState : AccessControl.AccessControlState,
  subjects : Map.Map<Common.SubjectId, Students.Subject>,
  gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>,
  grades : Map.Map<Nat, Grades.Grade>,
  counters : {
    var nextCategoryId : Nat;
    var nextGradeId : Nat;
  },
) {
  public query func listCategories() : async [Grades.GradeCategory] {
    GradesLib.listCategories(gradeCategories);
  };

  public shared ({ caller }) func addCategory(name : Text, semester : Common.Semester) : async Grades.GradeCategory {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    GradesLib.addCategory(gradeCategories, counters, name, semester);
  };

  public shared ({ caller }) func updateCategory(id : Common.CategoryId, name : Text, semester : Common.Semester) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    GradesLib.updateCategory(gradeCategories, id, name, semester);
  };

  public shared ({ caller }) func deleteCategory(id : Common.CategoryId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    GradesLib.deleteCategory(gradeCategories, id);
  };

  public query func listGrades(studentId : Common.StudentId, semester : Common.Semester) : async [Grades.GradeView] {
    GradesLib.listGrades(grades, subjects, gradeCategories, studentId, semester);
  };

  public query func listSubjectSummaries(studentId : Common.StudentId, semester : Common.Semester) : async [Grades.SubjectGradeSummary] {
    GradesLib.listSubjectSummaries(grades, subjects, gradeCategories, studentId, semester);
  };

  public query func getOverallAverage(studentId : Common.StudentId) : async Nat {
    GradesLib.getOverallAverage(grades, studentId);
  };

  public shared ({ caller }) func setGrade(input : Grades.GradeInput) : async Grades.GradeView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    GradesLib.setGrade(grades, subjects, gradeCategories, counters, input);
  };

  public shared ({ caller }) func deleteGrade(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    GradesLib.deleteGrade(grades, id);
  };
};
