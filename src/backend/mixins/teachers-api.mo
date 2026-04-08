import TeacherTypes "../types/teachers";
import Common "../types/common";
import AuthTypes "../types/auth";
import TeachersLib "../lib/teachers";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

mixin (
  teachers : Map.Map<Common.TeacherId, TeacherTypes.Teacher>,
  sessions : Map.Map<Text, AuthTypes.SessionInfo>,
) {
  var nextTeacherId : Nat = 1;

  func requireAdmin(token : Text) {
    switch (sessions.get(token)) {
      case (?s) {
        if (s.role != #Admin) Runtime.trap("Unauthorized: Admin role required");
      };
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
  };

  public shared func createTeacher(token : Text, input : TeacherTypes.CreateTeacherInput) : async TeacherTypes.Teacher {
    requireAdmin(token);
    let teacher = TeachersLib.createTeacher(teachers, nextTeacherId, input);
    nextTeacherId += 1;
    teacher;
  };

  public shared func updateTeacher(token : Text, input : TeacherTypes.UpdateTeacherInput) : async ?TeacherTypes.Teacher {
    requireAdmin(token);
    TeachersLib.updateTeacher(teachers, input);
  };

  public shared func deleteTeacher(token : Text, id : Common.TeacherId) : async Bool {
    requireAdmin(token);
    TeachersLib.deleteTeacher(teachers, id);
  };

  public query func getTeacher(id : Common.TeacherId) : async ?TeacherTypes.Teacher {
    TeachersLib.getTeacher(teachers, id);
  };

  public query func listTeachers() : async [TeacherTypes.Teacher] {
    TeachersLib.listTeachers(teachers);
  };
};
