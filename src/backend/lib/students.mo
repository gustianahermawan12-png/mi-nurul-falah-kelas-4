import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Common "../types/common";
import Students "../types/students";

module {
  public func listClasses(classes : Map.Map<Common.ClassId, Students.Class>) : [Students.Class] {
    classes.values().toArray();
  };

  public func addClass(classes : Map.Map<Common.ClassId, Students.Class>, counters : { var nextClassId : Nat }, name : Text) : Students.Class {
    let id = counters.nextClassId;
    counters.nextClassId += 1;
    let entry : Students.Class = { id; name };
    classes.add(id, entry);
    entry;
  };

  public func updateClass(classes : Map.Map<Common.ClassId, Students.Class>, id : Common.ClassId, name : Text) : () {
    classes.add(id, { id; name });
  };

  public func deleteClass(classes : Map.Map<Common.ClassId, Students.Class>, id : Common.ClassId) : () {
    classes.remove(id);
  };

  public func listSubjects(subjects : Map.Map<Common.SubjectId, Students.Subject>) : [Students.Subject] {
    subjects.values().toArray();
  };

  public func addSubject(subjects : Map.Map<Common.SubjectId, Students.Subject>, counters : { var nextSubjectId : Nat }, name : Text) : Students.Subject {
    let id = counters.nextSubjectId;
    counters.nextSubjectId += 1;
    let entry : Students.Subject = { id; name };
    subjects.add(id, entry);
    entry;
  };

  public func updateSubject(subjects : Map.Map<Common.SubjectId, Students.Subject>, id : Common.SubjectId, name : Text) : () {
    subjects.add(id, { id; name });
  };

  public func deleteSubject(subjects : Map.Map<Common.SubjectId, Students.Subject>, id : Common.SubjectId) : () {
    subjects.remove(id);
  };

  public func toView(student : Students.Student, classes : Map.Map<Common.ClassId, Students.Class>) : Students.StudentView {
    let className = switch (classes.get(student.classId)) {
      case (?c) { c.name };
      case null { "" };
    };
    {
      id = student.id;
      nisn = student.nisn;
      name = student.name;
      classId = student.classId;
      className;
      isActive = student.isActive;
    };
  };

  public func listStudents(students : Map.Map<Common.StudentId, Students.Student>, classes : Map.Map<Common.ClassId, Students.Class>) : [Students.StudentView] {
    students.values().toArray().map(func s = toView(s, classes));
  };

  public func getStudent(students : Map.Map<Common.StudentId, Students.Student>, classes : Map.Map<Common.ClassId, Students.Class>, id : Common.StudentId) : ?Students.StudentView {
    switch (students.get(id)) {
      case (?s) { ?toView(s, classes) };
      case null { null };
    };
  };

  public func addStudent(students : Map.Map<Common.StudentId, Students.Student>, classes : Map.Map<Common.ClassId, Students.Class>, counters : { var nextStudentId : Nat }, input : Students.StudentInput) : Students.StudentView {
    let id = counters.nextStudentId;
    counters.nextStudentId += 1;
    let entry : Students.Student = {
      id;
      nisn = input.nisn;
      name = input.name;
      classId = input.classId;
      isActive = input.isActive;
      parentPhone = input.parentPhone;
      parentPassword = input.parentPassword;
    };
    students.add(id, entry);
    toView(entry, classes);
  };

  public func updateStudent(students : Map.Map<Common.StudentId, Students.Student>, classes : Map.Map<Common.ClassId, Students.Class>, id : Common.StudentId, input : Students.StudentInput) : () {
    let entry : Students.Student = {
      id;
      nisn = input.nisn;
      name = input.name;
      classId = input.classId;
      isActive = input.isActive;
      parentPhone = input.parentPhone;
      parentPassword = input.parentPassword;
    };
    students.add(id, entry);
  };

  public func deleteStudent(students : Map.Map<Common.StudentId, Students.Student>, id : Common.StudentId) : () {
    students.remove(id);
  };

  public func getStudentByPhone(students : Map.Map<Common.StudentId, Students.Student>, phone : Text) : ?Students.Student {
    students.values().toArray().find(func s = s.parentPhone == phone);
  };
};
