import HomeworkTypes "../types/homework";
import Common "../types/common";
import AuthTypes "../types/auth";
import HomeworkLib "../lib/homework";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

mixin (
  sessions : Map.Map<Text, AuthTypes.SessionInfo>,
  homeworks : Map.Map<Common.HomeworkId, HomeworkTypes.Homework>,
  submissions : Map.Map<(Common.HomeworkId, Common.StudentId), HomeworkTypes.HomeworkSubmission>,
) {
  var nextHomeworkId : Nat = 1;

  public shared func createHomework(token : Text, input : HomeworkTypes.CreateHomeworkInput) : async HomeworkTypes.Homework {
    let s = switch (sessions.get(token)) {
      case (?s) s;
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
    switch (s.role) {
      case (#Admin or #Teacher) {};
      case _ Runtime.trap("Only Admin or Teacher can create homework");
    };
    let hw = HomeworkLib.createHomework(homeworks, nextHomeworkId, input);
    nextHomeworkId += 1;
    hw;
  };

  public query func listHomeworkByClass(classId : Text) : async [HomeworkTypes.Homework] {
    HomeworkLib.listHomeworkByClass(homeworks, classId);
  };

  public shared func markSubmission(token : Text, homeworkId : Common.HomeworkId, studentId : Common.StudentId) : async HomeworkTypes.HomeworkSubmission {
    switch (sessions.get(token)) {
      case (?_) {};
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
    HomeworkLib.markSubmission(submissions, homeworkId, studentId);
  };

  public query func getSubmissions(homeworkId : Common.HomeworkId) : async [HomeworkTypes.HomeworkSubmission] {
    HomeworkLib.getSubmissions(submissions, homeworkId);
  };
};
