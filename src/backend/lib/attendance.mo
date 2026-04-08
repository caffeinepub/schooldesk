import Types "../types/attendance";
import Common "../types/common";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Iter "mo:core/Iter";

module {
  public func markAttendance(
    records : Map.Map<Common.AttendanceId, Types.AttendanceRecord>,
    nextId : Nat,
    input : Types.MarkAttendanceInput,
  ) : Types.AttendanceRecord {
    let record : Types.AttendanceRecord = {
      id = nextId;
      studentId = input.studentId;
      date = input.date;
      status = input.status;
      markedBy = input.markedBy;
    };
    records.add(nextId, record);
    record;
  };

  public func getAttendanceByStudent(
    records : Map.Map<Common.AttendanceId, Types.AttendanceRecord>,
    studentId : Common.StudentId,
  ) : [Types.AttendanceRecord] {
    records.entries()
      .filterMap(func((_, r) : (Common.AttendanceId, Types.AttendanceRecord)) : ?Types.AttendanceRecord {
        if (r.studentId == studentId) ?r else null
      })
      .sort(func(a : Types.AttendanceRecord, b : Types.AttendanceRecord) : { #equal; #greater; #less } { Int.compare(b.date, a.date) })
      .toArray();
  };

  public func getAttendanceByClass(
    records : Map.Map<Common.AttendanceId, Types.AttendanceRecord>,
    students : Map.Map<Common.StudentId, { id : Common.StudentId; class_ : Text }>,
    classId : Text,
    date : Common.Timestamp,
  ) : [Types.AttendanceRecord] {
    // Date boundaries: same day (treat date as a day-precision timestamp in nanoseconds)
    let dayNs : Int = 86_400_000_000_000; // 1 day in nanoseconds
    let dayStart = (date / dayNs) * dayNs;
    let dayEnd = dayStart + dayNs;

    records.entries()
      .filterMap(func((_, r) : (Common.AttendanceId, Types.AttendanceRecord)) : ?Types.AttendanceRecord {
        if (r.date >= dayStart and r.date < dayEnd) {
          // Check if student is in the given class
          switch (students.get(r.studentId)) {
            case (?s) { if (s.class_ == classId) ?r else null };
            case null null;
          };
        } else null;
      })
      .toArray();
  };

  public func getAttendanceSummary(
    records : Map.Map<Common.AttendanceId, Types.AttendanceRecord>,
    studentId : Common.StudentId,
  ) : Types.AttendanceSummary {
    var presentDays : Nat = 0;
    var absentDays : Nat = 0;
    var lateDays : Nat = 0;

    for ((_, r) in records.entries()) {
      if (r.studentId == studentId) {
        switch (r.status) {
          case (#Present) { presentDays += 1 };
          case (#Absent) { absentDays += 1 };
          case (#Late) { lateDays += 1 };
        };
      };
    };

    {
      studentId;
      totalDays = presentDays + absentDays + lateDays;
      presentDays;
      absentDays;
      lateDays;
    };
  };
};
