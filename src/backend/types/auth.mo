import Common "common";

module {
  public type UserKind = { #guru; #orangTua };

  public type Session = {
    token : Text;
    kind : UserKind;
    studentId : ?Common.StudentId;
    createdAt : Common.Timestamp;
  };

  public type TeacherCredentials = {
    username : Text;
    password : Text;
  };

  public type LoginResult = {
    #ok : Session;
    #err : Text;
  };
};
