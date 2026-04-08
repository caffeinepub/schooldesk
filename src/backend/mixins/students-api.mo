import StudentTypes "../types/students";
import Common "../types/common";
import AuthTypes "../types/auth";
import StudentsLib "../lib/students";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

mixin (
  students : Map.Map<Common.StudentId, StudentTypes.Student>,
  sessions : Map.Map<Text, AuthTypes.SessionInfo>,
) {
  var nextStudentId : Nat = 1;

  func assertAdmin(token : Text) {
    switch (sessions.get(token)) {
      case (?s) {
        if (s.role != #Admin) Runtime.trap("Unauthorized: Admin only");
      };
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
  };

  public shared func createStudent(token : Text, input : StudentTypes.CreateStudentInput) : async StudentTypes.Student {
    assertAdmin(token);
    let student = StudentsLib.createStudent(students, nextStudentId, input);
    nextStudentId += 1;
    student;
  };

  public shared func updateStudent(token : Text, input : StudentTypes.UpdateStudentInput) : async ?StudentTypes.Student {
    assertAdmin(token);
    StudentsLib.updateStudent(students, input);
  };

  public shared func deleteStudent(token : Text, id : Common.StudentId) : async Bool {
    assertAdmin(token);
    StudentsLib.deleteStudent(students, id);
  };

  public query func getStudent(id : Common.StudentId) : async ?StudentTypes.Student {
    StudentsLib.getStudent(students, id);
  };

  public query func listStudents() : async [StudentTypes.Student] {
    StudentsLib.listStudents(students);
  };
};
