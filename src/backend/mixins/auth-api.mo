import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Auth "../types/auth";
import Students "../types/students";
import AuthLib "../lib/auth";

mixin (
  accessControlState : AccessControl.AccessControlState,
  sessions : Map.Map<Text, Auth.Session>,
  teacherCredentials : Auth.TeacherCredentials,
  students : Map.Map<Common.StudentId, Students.Student>,
) {
  public shared ({ caller }) func loginTeacher(username : Text, password : Text) : async Auth.LoginResult {
    AuthLib.loginTeacher(sessions, accessControlState, caller, teacherCredentials, username, password);
  };

  public shared func loginParent(identifier : Text, password : Text) : async Auth.LoginResult {
    AuthLib.loginParent(sessions, students, identifier, password);
  };

  public query func getSession(token : Text) : async ?Auth.Session {
    AuthLib.getSession(sessions, token);
  };

  public shared func logout(token : Text) : async () {
    AuthLib.logout(sessions, token);
  };

  public query func getTeacherCredentials() : async Auth.TeacherCredentials {
    AuthLib.getTeacherCredentials(teacherCredentials);
  };
};
