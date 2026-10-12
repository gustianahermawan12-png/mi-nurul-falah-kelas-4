import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Common "../types/common";
import Students "../types/students";
import Grades "../types/grades";

module {
  public func listCategories(gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>) : [Grades.GradeCategory] {
    gradeCategories.values().toArray();
  };

  public func addCategory(gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>, counters : { var nextCategoryId : Nat }, name : Text, semester : Common.Semester) : Grades.GradeCategory {
    let id = counters.nextCategoryId;
    counters.nextCategoryId += 1;
    let entry : Grades.GradeCategory = { id; name; semester };
    gradeCategories.add(id, entry);
    entry;
  };

  public func updateCategory(gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>, id : Common.CategoryId, name : Text, semester : Common.Semester) : () {
    gradeCategories.add(id, { id; name; semester });
  };

  public func deleteCategory(gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>, id : Common.CategoryId) : () {
    gradeCategories.remove(id);
  };

  public func toView(grade : Grades.Grade, subjects : Map.Map<Common.SubjectId, Students.Subject>, gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>) : Grades.GradeView {
    let subjectName = switch (subjects.get(grade.subjectId)) {
      case (?s) { s.name };
      case null { "" };
    };
    let (categoryName, semester) = switch (gradeCategories.get(grade.categoryId)) {
      case (?c) { (c.name, c.semester) };
      case null { ("", #semester1) };
    };
    {
      id = grade.id;
      subjectId = grade.subjectId;
      subjectName;
      categoryId = grade.categoryId;
      categoryName;
      semester;
      score = grade.score;
    };
  };

  public func listGrades(grades : Map.Map<Nat, Grades.Grade>, subjects : Map.Map<Common.SubjectId, Students.Subject>, gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>, studentId : Common.StudentId, semester : Common.Semester) : [Grades.GradeView] {
    grades.values().toArray()
      .filter(func g = g.studentId == studentId)
      .map(func g = toView(g, subjects, gradeCategories))
      .filter(func v = v.semester == semester);
  };

  public func listSubjectSummaries(grades : Map.Map<Nat, Grades.Grade>, subjects : Map.Map<Common.SubjectId, Students.Subject>, gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>, studentId : Common.StudentId, semester : Common.Semester) : [Grades.SubjectGradeSummary] {
    let views = listGrades(grades, subjects, gradeCategories, studentId, semester);
    let subjectIds = views.map(func v = v.subjectId);
    let uniqueIds = subjectIds.foldLeft<Common.SubjectId, [Common.SubjectId]>(
      [],
      func(acc, id) {
        if (acc.contains(id)) { acc } else { acc.concat([id]) };
      },
    );
    uniqueIds.map(func(subjectId) {
      let components = views.filter(func v = v.subjectId == subjectId);
      let subjectName = switch (subjects.get(subjectId)) {
        case (?s) { s.name };
        case null { "" };
      };
      let total = components.foldLeft(0, func(acc, v) = acc + v.score);
      let average = if (components.size() == 0) { 0 } else { total / components.size() };
      {
        subjectId;
        subjectName;
        semester;
        components;
        average;
      };
    });
  };

  public func getOverallAverage(grades : Map.Map<Nat, Grades.Grade>, studentId : Common.StudentId) : Nat {
    let studentGrades = grades.values().toArray().filter(func g = g.studentId == studentId);
    let total = studentGrades.foldLeft(0, func(acc, g) = acc + g.score);
    if (studentGrades.size() == 0) { 0 } else { total / studentGrades.size() };
  };

  public func setGrade(grades : Map.Map<Nat, Grades.Grade>, subjects : Map.Map<Common.SubjectId, Students.Subject>, gradeCategories : Map.Map<Common.CategoryId, Grades.GradeCategory>, counters : { var nextGradeId : Nat }, input : Grades.GradeInput) : Grades.GradeView {
    let existing = grades.values().toArray().find(func g = g.studentId == input.studentId and g.subjectId == input.subjectId and g.categoryId == input.categoryId);
    let id = switch (existing) {
      case (?g) { g.id };
      case null {
        let newId = counters.nextGradeId;
        counters.nextGradeId += 1;
        newId;
      };
    };
    let entry : Grades.Grade = {
      id;
      studentId = input.studentId;
      subjectId = input.subjectId;
      categoryId = input.categoryId;
      score = input.score;
    };
    grades.add(id, entry);
    toView(entry, subjects, gradeCategories);
  };

  public func deleteGrade(grades : Map.Map<Nat, Grades.Grade>, id : Nat) : () {
    grades.remove(id);
  };
};
