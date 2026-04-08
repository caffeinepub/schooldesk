import AnalyticsTypes "../types/analytics";
import FeeTypes "../types/fees";
import AttendanceTypes "../types/attendance";
import StudentTypes "../types/students";
import TeacherTypes "../types/teachers";
import Common "../types/common";
import AnalyticsLib "../lib/analytics";
import Map "mo:core/Map";

mixin (
  students : Map.Map<Common.StudentId, StudentTypes.Student>,
  teachers : Map.Map<Common.TeacherId, TeacherTypes.Teacher>,
  fees : Map.Map<Common.FeeId, FeeTypes.FeeRecord>,
  attendanceRecords : Map.Map<Common.AttendanceId, AttendanceTypes.AttendanceRecord>,
) {
  public query func getTotalStudents() : async Nat {
    AnalyticsLib.getTotalStudents(students);
  };

  public query func getTotalTeachers() : async Nat {
    AnalyticsLib.getTotalTeachers(teachers);
  };

  public query func getFeesCollectionSummary() : async AnalyticsTypes.FeesCollectionSummary {
    AnalyticsLib.getFeesCollectionSummary(fees);
  };

  public query func getAttendanceRateSummary() : async AnalyticsTypes.AttendanceRateSummary {
    AnalyticsLib.getAttendanceRateSummary(attendanceRecords);
  };

  public query func getEnrollmentByClass() : async [AnalyticsTypes.EnrollmentByClass] {
    AnalyticsLib.getEnrollmentByClass(students);
  };
};
