module {
  public type UserId = Nat;
  public type StudentId = Nat;
  public type TeacherId = Nat;
  public type HomeworkId = Nat;
  public type FeeId = Nat;
  public type AttendanceId = Nat;
  public type MarkId = Nat;
  public type NoticeId = Nat;
  public type Timestamp = Int;

  public type Role = {
    #Admin;
    #Teacher;
    #Student;
  };

  public type UserProfile = {
    id : Text;
    username : Text;
    name : Text;
    role : Role;
    roleId : Text;
    createdAt : Timestamp;
  };
};
