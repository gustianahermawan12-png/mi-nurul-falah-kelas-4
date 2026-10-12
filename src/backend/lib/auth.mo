import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Auth "../types/auth";
import Students "../types/students";

module {
  public func loginTeacher(sessions : Map.Map<Text, Auth.Session>, accessControlState : AccessControl.AccessControlState, caller : Principal, teacherCredentials : Auth.TeacherCredentials, username : Text, password : Text) : Auth.LoginResult {
    if (username != teacherCredentials.username or password != teacherCredentials.password) {
      return #err("Username atau kata sandi guru salah");
    };
    // The teacher credentials are the authority for this app's custom login.
    // Grant the authenticated caller the #admin role so teacher write guards pass.
    if (not caller.isAnonymous()) {
      accessControlState.userRoles.add(caller, #admin);
      accessControlState.adminAssigned := true;
    };
    let token = "guru-" # Time.now().toText();
    let session : Auth.Session = {
      token;
      kind = #guru;
      studentId = null;
          createdAt = Time.now().toNat();
    };
    sessions.add(token, session);
    #ok(session);
  };

  public func loginParent(sessions : Map.Map<Text, Auth.Session>, students : Map.Map<Common.StudentId, Students.Student>, identifier : Text, password : Text) : Auth.LoginResult {
    let student = students.values().toArray().find(func s = s.nisn == identifier or s.parentPhone == identifier);
    switch (student) {
      case (?s) {
        if (s.parentPassword != password) {
          return #err("Kata sandi salah");
        };
        if (not s.isActive) {
          return #err("Akun siswa tidak aktif");
        };
        let token = "ortu-" # s.id.toText() # "-" # Time.now().toText();
        let session : Auth.Session = {
          token;
          kind = #orangTua;
          studentId = ?s.id;
      createdAt = Time.now().toNat();
        };
        sessions.add(token, session);
        #ok(session);
      };
      case null { #err("NISN/Nomor HP tidak terdaftar") };
    };
  };

  public func getSession(sessions : Map.Map<Text, Auth.Session>, token : Text) : ?Auth.Session {
    sessions.get(token);
  };

  public func logout(sessions : Map.Map<Text, Auth.Session>, token : Text) : () {
    sessions.remove(token);
  };

  public func getTeacherCredentials(teacherCredentials : Auth.TeacherCredentials) : Auth.TeacherCredentials {
    teacherCredentials;
  };

  // Session-based authorization: the app authenticates via loginTeacher/loginParent
  // tokens, not Internet Identity roles. A caller is a teacher when it presents a
  // valid session token of kind #guru.
  public func isTeacherSession(sessions : Map.Map<Text, Auth.Session>, token : Text) : Bool {
    switch (sessions.get(token)) {
      case (?session) { session.kind == #guru };
      case null { false };
    };
  };

  public func isRegisteredSession(sessions : Map.Map<Text, Auth.Session>, token : Text) : Bool {
    sessions.get(token) != null;
  };
};
