import Common "common";

module {
  public type FeesCollectionSummary = {
    totalAmount : Nat;
    collectedAmount : Nat;
    pendingAmount : Nat;
    lateAmount : Nat;
  };

  public type AttendanceRateSummary = {
    totalRecords : Nat;
    presentCount : Nat;
    absentCount : Nat;
    lateCount : Nat;
    attendanceRate : Nat;
  };

  public type EnrollmentByClass = {
    classId : Text;
    studentCount : Nat;
  };
};
