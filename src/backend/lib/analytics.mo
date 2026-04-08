import AnalyticsTypes "../types/analytics";
import FeeTypes "../types/fees";
import AttendanceTypes "../types/attendance";
import StudentTypes "../types/students";
import TeacherTypes "../types/teachers";
import Common "../types/common";
import Map "mo:core/Map";

module {
  public func getTotalStudents(
    students : Map.Map<Common.StudentId, StudentTypes.Student>,
  ) : Nat {
    students.size();
  };

  public func getTotalTeachers(
    teachers : Map.Map<Common.TeacherId, TeacherTypes.Teacher>,
  ) : Nat {
    teachers.size();
  };

  public func getFeesCollectionSummary(
    fees : Map.Map<Common.FeeId, FeeTypes.FeeRecord>,
  ) : AnalyticsTypes.FeesCollectionSummary {
    fees.foldLeft(
      { totalAmount = 0; collectedAmount = 0; pendingAmount = 0; lateAmount = 0 },
      func(acc : AnalyticsTypes.FeesCollectionSummary, _id : Common.FeeId, fee : FeeTypes.FeeRecord) : AnalyticsTypes.FeesCollectionSummary {
        let total = acc.totalAmount + fee.amount;
        switch (fee.status) {
          case (#Paid) {
            { acc with totalAmount = total; collectedAmount = acc.collectedAmount + fee.amount };
          };
          case (#Unpaid) {
            { acc with totalAmount = total; pendingAmount = acc.pendingAmount + fee.amount };
          };
          case (#Late) {
            { acc with totalAmount = total; lateAmount = acc.lateAmount + fee.lateFeeAmount; pendingAmount = acc.pendingAmount + fee.amount };
          };
        };
      },
    );
  };

  public func getAttendanceRateSummary(
    records : Map.Map<Common.AttendanceId, AttendanceTypes.AttendanceRecord>,
  ) : AnalyticsTypes.AttendanceRateSummary {
    let total = records.size();
    type Counts = { present : Nat; absent : Nat; late : Nat };
    let counts = records.foldLeft(
      { present = 0; absent = 0; late = 0 } : Counts,
      func(acc : Counts, _id : Common.AttendanceId, r : AttendanceTypes.AttendanceRecord) : Counts {
        switch (r.status) {
          case (#Present) { { acc with present = acc.present + 1 } };
          case (#Absent)  { { acc with absent = acc.absent + 1 } };
          case (#Late)    { { acc with late = acc.late + 1 } };
        };
      },
    );
    let presentCount = counts.present;
    let absentCount = counts.absent;
    let lateCount = counts.late;
    let rate : Nat = if (total == 0) 0 else (presentCount * 100) / total;
    {
      totalRecords = total;
      presentCount;
      absentCount;
      lateCount;
      attendanceRate = rate;
    };
  };

  public func getEnrollmentByClass(
    students : Map.Map<Common.StudentId, StudentTypes.Student>,
  ) : [AnalyticsTypes.EnrollmentByClass] {
    // Accumulate class counts into a Map<Text, Nat>
    let classCounts = Map.empty<Text, Nat>();
    students.forEach(func(_id : Common.StudentId, s : StudentTypes.Student) {
      let current = switch (classCounts.get(s.class_)) {
        case (?n) n;
        case null 0;
      };
      classCounts.add(s.class_, current + 1);
    });
    // Convert to array
    let iter = classCounts.entries();
    let result = iter.map(
      func((classId, count) : (Text, Nat)) : AnalyticsTypes.EnrollmentByClass { { classId; studentCount = count } }
    );
    result.toArray();
  };
};
