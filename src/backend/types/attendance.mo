import Common "common";

module {
  public type AttendanceStatus = {
    #Present;
    #Absent;
    #Late;
  };

  public type AttendanceRecord = {
    id : Common.AttendanceId;
    studentId : Common.StudentId;
    date : Common.Timestamp;
    status : AttendanceStatus;
    markedBy : Text;
  };

  public type AttendanceSummary = {
    studentId : Common.StudentId;
    totalDays : Nat;
    presentDays : Nat;
    absentDays : Nat;
    lateDays : Nat;
  };

  public type MarkAttendanceInput = {
    studentId : Common.StudentId;
    date : Common.Timestamp;
    status : AttendanceStatus;
    markedBy : Text;
  };
};
