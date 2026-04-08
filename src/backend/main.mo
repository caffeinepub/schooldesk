import Common "types/common";
import AuthTypes "types/auth";
import StudentTypes "types/students";
import TeacherTypes "types/teachers";
import FeeTypes "types/fees";
import AttendanceTypes "types/attendance";
import HomeworkTypes "types/homework";
import MarkTypes "types/marks";
import NoticeTypes "types/notices";
import Map "mo:core/Map";

import AuthApi "mixins/auth-api";
import StudentsApi "mixins/students-api";
import TeachersApi "mixins/teachers-api";
import FeesApi "mixins/fees-api";
import AttendanceApi "mixins/attendance-api";
import HomeworkApi "mixins/homework-api";
import MarksApi "mixins/marks-api";
import NoticesApi "mixins/notices-api";
import AnalyticsApi "mixins/analytics-api";



actor {
  // --- Auth state ---
  let credentials = Map.empty<Text, Text>();        // username -> password
  let userProfiles = Map.empty<Text, Common.UserProfile>(); // username -> profile
  let sessions = Map.empty<Text, AuthTypes.SessionInfo>();  // token -> session

  // --- Student state ---
  let students = Map.empty<Common.StudentId, StudentTypes.Student>();

  // --- Teacher state ---
  let teachers = Map.empty<Common.TeacherId, TeacherTypes.Teacher>();

  // --- Fees state ---
  let fees = Map.empty<Common.FeeId, FeeTypes.FeeRecord>();

  // --- Attendance state ---
  let attendanceRecords = Map.empty<Common.AttendanceId, AttendanceTypes.AttendanceRecord>();

  // --- Homework state ---
  let homeworks = Map.empty<Common.HomeworkId, HomeworkTypes.Homework>();
  let submissions = Map.empty<(Common.HomeworkId, Common.StudentId), HomeworkTypes.HomeworkSubmission>();

  // --- Marks state ---
  let marks = Map.empty<Common.MarkId, MarkTypes.Mark>();

  // --- Notices state ---
  let notices = Map.empty<Common.NoticeId, NoticeTypes.Notice>();

  // --- Mixin includes ---
  include AuthApi(credentials, userProfiles, sessions);
  include StudentsApi(students, sessions);
  include TeachersApi(teachers, sessions);
  include FeesApi(fees, sessions);
  include AttendanceApi(attendanceRecords, students, sessions);
  include HomeworkApi(sessions, homeworks, submissions);
  include MarksApi(marks, sessions, students);
  include NoticesApi(notices, sessions);
  include AnalyticsApi(students, teachers, fees, attendanceRecords);
};
