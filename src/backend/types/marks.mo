import Common "common";

module {
  public type Mark = {
    id : Common.MarkId;
    studentId : Common.StudentId;
    subject : Text;
    assessmentName : Text;
    score : Nat;
    maxScore : Nat;
    date : Common.Timestamp;
  };

  public type AddMarkInput = {
    studentId : Common.StudentId;
    subject : Text;
    assessmentName : Text;
    score : Nat;
    maxScore : Nat;
    date : Common.Timestamp;
  };

  public type UpdateMarkInput = {
    id : Common.MarkId;
    score : Nat;
    maxScore : Nat;
    assessmentName : Text;
  };
};
