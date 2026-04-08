import Types "../types/homework";
import Common "../types/common";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

module {
  // Compare function for composite tuple keys (HomeworkId, StudentId)
  public func compareKey(
    a : (Common.HomeworkId, Common.StudentId),
    b : (Common.HomeworkId, Common.StudentId),
  ) : Order.Order {
    let (ah, as_) = a;
    let (bh, bs) = b;
    switch (Nat.compare(ah, bh)) {
      case (#equal) Nat.compare(as_, bs);
      case other other;
    };
  };

  public func createHomework(
    homeworks : Map.Map<Common.HomeworkId, Types.Homework>,
    nextId : Nat,
    input : Types.CreateHomeworkInput,
  ) : Types.Homework {
    let hw : Types.Homework = {
      id = nextId;
      title = input.title;
      description = input.description;
      classId = input.classId;
      dueDate = input.dueDate;
      createdBy = input.createdBy;
      createdAt = Time.now();
    };
    homeworks.add(nextId, hw);
    hw;
  };

  public func listHomeworkByClass(
    homeworks : Map.Map<Common.HomeworkId, Types.Homework>,
    classId : Text,
  ) : [Types.Homework] {
    homeworks.values().filter(func(hw) { hw.classId == classId }).toArray();
  };

  public func markSubmission(
    submissions : Map.Map<(Common.HomeworkId, Common.StudentId), Types.HomeworkSubmission>,
    homeworkId : Common.HomeworkId,
    studentId : Common.StudentId,
  ) : Types.HomeworkSubmission {
    let key = (homeworkId, studentId);
    let sub : Types.HomeworkSubmission = switch (submissions.get(compareKey, key)) {
      case (?existing) {
        { existing with status = #Submitted; submittedAt = Time.now() };
      };
      case null {
        {
          homeworkId;
          studentId;
          submittedAt = Time.now();
          status = #Submitted;
        };
      };
    };
    submissions.add(compareKey, key, sub);
    sub;
  };

  public func getSubmissions(
    submissions : Map.Map<(Common.HomeworkId, Common.StudentId), Types.HomeworkSubmission>,
    homeworkId : Common.HomeworkId,
  ) : [Types.HomeworkSubmission] {
    submissions.values().filter(func(s) { s.homeworkId == homeworkId }).toArray();
  };
};
