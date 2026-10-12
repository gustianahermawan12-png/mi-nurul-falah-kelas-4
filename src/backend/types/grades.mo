import Common "common";

module {
  public type GradeCategory = {
    id : Common.CategoryId;
    name : Text;
    semester : Common.Semester;
  };

  public type Grade = {
    id : Nat;
    studentId : Common.StudentId;
    subjectId : Common.SubjectId;
    categoryId : Common.CategoryId;
    score : Nat;
  };

  public type GradeView = {
    id : Nat;
    subjectId : Common.SubjectId;
    subjectName : Text;
    categoryId : Common.CategoryId;
    categoryName : Text;
    semester : Common.Semester;
    score : Nat;
  };

  public type SubjectGradeSummary = {
    subjectId : Common.SubjectId;
    subjectName : Text;
    semester : Common.Semester;
    components : [GradeView];
    average : Nat;
  };

  public type GradeInput = {
    studentId : Common.StudentId;
    subjectId : Common.SubjectId;
    categoryId : Common.CategoryId;
    score : Nat;
  };
};
