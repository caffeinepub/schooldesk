import AttendanceTypes "../types/attendance";
import StudentTypes "../types/students";
import Common "../types/common";
import AuthTypes "../types/auth";
import AttendanceLib "../lib/attendance";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

mixin (
  attendanceRecords : Map.Map<Common.AttendanceId, AttendanceTypes.AttendanceRecord>,
  students : Map.Map<Common.StudentId, StudentTypes.Student>,
  sessions : Map.Map<Text, AuthTypes.SessionInfo>,
) {
  var nextAttendanceId : Nat = 1;

  func assertCanMark(token : Text) {
    switch (sessions.get(token)) {
      case (?s) {
        switch (s.role) {
          case (#Admin or #Teacher) {};
          case (#Student) Runtime.trap("Unauthorized: only Admin or Teacher can mark attendance");
        };
      };
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
  };

  func assertCanReadStudent(token : Text, studentId : Common.StudentId) {
    switch (sessions.get(token)) {
      case (?s) {
        switch (s.role) {
          case (#Admin or #Teacher) {};
          case (#Student) {
            var ownId : ?Common.StudentId = null;
            for ((_, st) in students.entries()) {
              if (st.grNo == s.roleId) { ownId := ?st.id };
            };
            switch (ownId) {
              case (?id) {
                if (id != studentId) Runtime.trap("Unauthorized: can only view your own attendance");
              };
              case null Runtime.trap("Unauthorized: student profile not found");
            };
          };
        };
      };
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
  };

  public shared func markAttendance(token : Text, input : AttendanceTypes.MarkAttendanceInput) : async AttendanceTypes.AttendanceRecord {
    assertCanMark(token);
    let record = AttendanceLib.markAttendance(attendanceRecords, nextAttendanceId, input);
    nextAttendanceId += 1;
    record;
  };

  public query func getAttendanceByStudent(token : Text, studentId : Common.StudentId) : async [AttendanceTypes.AttendanceRecord] {
    assertCanReadStudent(token, studentId);
    AttendanceLib.getAttendanceByStudent(attendanceRecords, studentId);
  };

  public query func getAttendanceByClass(token : Text, classId : Text, date : Common.Timestamp) : async [AttendanceTypes.AttendanceRecord] {
    switch (sessions.get(token)) {
      case (?s) {
        switch (s.role) {
          case (#Admin or #Teacher) {};
          case (#Student) Runtime.trap("Unauthorized: only Admin or Teacher can query by class");
        };
      };
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
    let classStudents = students.map<Common.StudentId, StudentTypes.Student, { id : Common.StudentId; class_ : Text }>(func(_ : Common.StudentId, s : StudentTypes.Student) : { id : Common.StudentId; class_ : Text } {
      { id = s.id; class_ = s.class_ }
    });
    AttendanceLib.getAttendanceByClass(attendanceRecords, classStudents, classId, date);
  };

  public query func getAttendanceSummary(token : Text, studentId : Common.StudentId) : async AttendanceTypes.AttendanceSummary {
    assertCanReadStudent(token, studentId);
    AttendanceLib.getAttendanceSummary(attendanceRecords, studentId);
  };
};
