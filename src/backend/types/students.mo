import Common "common";

module {
  public type Class = {
    id : Common.ClassId;
    name : Text;
  };

  public type Subject = {
    id : Common.SubjectId;
    name : Text;
  };

  public type Student = {
    id : Common.StudentId;
    nisn : Text;
    name : Text;
    classId : Common.ClassId;
    isActive : Bool;
    parentPhone : Text;
    parentPassword : Text;
  };

  public type StudentView = {
    id : Common.StudentId;
    nisn : Text;
    name : Text;
    classId : Common.ClassId;
    className : Text;
    isActive : Bool;
  };

  public type StudentInput = {
    nisn : Text;
    name : Text;
    classId : Common.ClassId;
    isActive : Bool;
    parentPhone : Text;
    parentPassword : Text;
  };
};
