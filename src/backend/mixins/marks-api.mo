import MarkTypes "../types/marks";
import StudentTypes "../types/students";
import Common "../types/common";
import AuthTypes "../types/auth";
import MarksLib "../lib/marks";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

mixin (
  marks : Map.Map<Common.MarkId, MarkTypes.Mark>,
  sessions : Map.Map<Text, AuthTypes.SessionInfo>,
  students : Map.Map<Common.StudentId, StudentTypes.Student>,
) {
  var nextMarkId : Nat = 1;

  public shared func addMark(token : Text, input : MarkTypes.AddMarkInput) : async MarkTypes.Mark {
    let s = switch (sessions.get(token)) {
      case (?s) s;
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
    switch (s.role) {
      case (#Admin or #Teacher) {};
      case _ Runtime.trap("Unauthorized: only Admin or Teacher can add marks");
    };
    let mark = MarksLib.addMark(marks, nextMarkId, input);
    nextMarkId += 1;
    mark;
  };

  public shared func updateMark(token : Text, input : MarkTypes.UpdateMarkInput) : async ?MarkTypes.Mark {
    let s = switch (sessions.get(token)) {
      case (?s) s;
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
    switch (s.role) {
      case (#Admin or #Teacher) {};
      case _ Runtime.trap("Unauthorized: only Admin or Teacher can update marks");
    };
    MarksLib.updateMark(marks, input);
  };

  public query func getMarksByStudent(token : Text, studentId : Common.StudentId) : async [MarkTypes.Mark] {
    let s = switch (sessions.get(token)) {
      case (?s) s;
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
    switch (s.role) {
      case (#Student) {
        let ownStudent = students.values().find(func(st) { st.grNo == s.roleId });
        let ownId = switch (ownStudent) {
          case (?st) st.id;
          case null Runtime.trap("Student record not found");
        };
        if (ownId != studentId) Runtime.trap("Unauthorized: students can only view own marks");
      };
      case (#Admin or #Teacher) {};
    };
    MarksLib.getMarksByStudent(marks, studentId);
  };

  public query func getMarksBySubject(token : Text, subject : Text) : async [MarkTypes.Mark] {
    let s = switch (sessions.get(token)) {
      case (?s) s;
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
    switch (s.role) {
      case (#Admin or #Teacher) {};
      case _ Runtime.trap("Unauthorized: only Admin or Teacher can view marks by subject");
    };
    MarksLib.getMarksBySubject(marks, subject);
  };
};
