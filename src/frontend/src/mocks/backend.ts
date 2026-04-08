import type { backendInterface } from "../backend";
import {
  AttendanceStatus,
  Audience,
  FeeStatus,
  Role,
  SubmissionStatus,
} from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

export const mockBackend: backendInterface = {
  login: async (_username, _password) => ({
    __kind__: "ok",
    ok: "mock-session-token",
  }),

  logout: async (_token) => {},

  validateSession: async (_token) => ({
    id: "admin",
    username: "admin",
    name: "Admin User",
    createdAt: now,
    role: Role.Admin,
    roleId: "ADM001",
  }),

  addUser: async (_token, _input) => ({
    __kind__: "ok",
    ok: {
      id: "usr001",
      username: "newuser",
      name: "New User",
      createdAt: now,
      role: Role.Teacher,
      roleId: "TCH003",
    },
  }),

  getTotalStudents: async () => BigInt(248),
  getTotalTeachers: async () => BigInt(18),

  getFeesCollectionSummary: async () => ({
    lateAmount: BigInt(12000),
    totalAmount: BigInt(500000),
    pendingAmount: BigInt(85000),
    collectedAmount: BigInt(415000),
  }),

  getAttendanceRateSummary: async () => ({
    presentCount: BigInt(210),
    attendanceRate: BigInt(87),
    lateCount: BigInt(15),
    totalRecords: BigInt(248),
    absentCount: BigInt(23),
  }),

  getEnrollmentByClass: async () => [
    { classId: "Grade 1", studentCount: BigInt(42) },
    { classId: "Grade 2", studentCount: BigInt(38) },
    { classId: "Grade 3", studentCount: BigInt(45) },
    { classId: "Grade 4", studentCount: BigInt(35) },
    { classId: "Grade 5", studentCount: BigInt(41) },
    { classId: "Grade 6", studentCount: BigInt(47) },
  ],

  listStudents: async () => [
    {
      id: BigInt(1),
      grNo: "GR001",
      name: "Aisha Malik",
      class: "Grade 5",
      section: "A",
      parentContact: "03001234567",
      photoUrl: "",
      createdAt: now,
    },
    {
      id: BigInt(2),
      grNo: "GR002",
      name: "Ahmed Khan",
      class: "Grade 5",
      section: "B",
      parentContact: "03009876543",
      photoUrl: "",
      createdAt: now,
    },
    {
      id: BigInt(3),
      grNo: "GR003",
      name: "Sara Hussain",
      class: "Grade 6",
      section: "A",
      parentContact: "03012345678",
      photoUrl: "",
      createdAt: now,
    },
  ],

  listTeachers: async () => [
    {
      id: BigInt(1),
      teacherId: "TCH001",
      name: "Mr. Imran Ali",
      subjects: ["Mathematics", "Physics"],
      classesAssigned: ["Grade 5A", "Grade 6B"],
      createdAt: now,
    },
    {
      id: BigInt(2),
      teacherId: "TCH002",
      name: "Ms. Fatima Noor",
      subjects: ["English", "Urdu"],
      classesAssigned: ["Grade 4A", "Grade 5B"],
      createdAt: now,
    },
  ],

  listNotices: async (_audience, _classId) => [
    {
      id: BigInt(1),
      title: "Annual Sports Day",
      content: "Annual Sports Day will be held on 20th April. All students must participate.",
      createdAt: now,
      createdBy: "Admin",
      audience: Audience.All,
    },
    {
      id: BigInt(2),
      title: "Parent-Teacher Meeting",
      content: "PTM scheduled for Grade 5 and 6 on 15th April at 10am.",
      createdAt: now - BigInt(86400) * BigInt(1_000_000_000),
      createdBy: "Admin",
      audience: Audience.All,
    },
    {
      id: BigInt(3),
      title: "Fee Submission Reminder",
      content: "Last date for fee submission is 10th April. Please submit on time.",
      createdAt: now - BigInt(172800) * BigInt(1_000_000_000),
      createdBy: "Admin",
      audience: Audience.All,
    },
  ],

  listAllFees: async () => [
    {
      id: BigInt(1),
      studentId: BigInt(1),
      amount: BigInt(5000),
      lateFeeAmount: BigInt(0),
      dueDate: now + BigInt(864000) * BigInt(1_000_000_000),
      status: FeeStatus.Paid,
      receiptNumber: "REC001",
      paidDate: now,
    },
    {
      id: BigInt(2),
      studentId: BigInt(2),
      amount: BigInt(5000),
      lateFeeAmount: BigInt(500),
      dueDate: now - BigInt(86400) * BigInt(1_000_000_000),
      status: FeeStatus.Unpaid,
      receiptNumber: "REC002",
    },
  ],

  listFeesByStudent: async (_studentId) => [
    {
      id: BigInt(1),
      studentId: BigInt(1),
      amount: BigInt(5000),
      lateFeeAmount: BigInt(0),
      dueDate: now + BigInt(864000) * BigInt(1_000_000_000),
      status: FeeStatus.Paid,
      receiptNumber: "REC001",
      paidDate: now,
    },
  ],

  getMarksByStudent: async (_token, _studentId) => [
    {
      id: BigInt(1),
      studentId: BigInt(1),
      subject: "Mathematics",
      assessmentName: "Mid-Term",
      score: BigInt(85),
      maxScore: BigInt(100),
      date: now - BigInt(2592000) * BigInt(1_000_000_000),
    },
    {
      id: BigInt(2),
      studentId: BigInt(1),
      subject: "English",
      assessmentName: "Mid-Term",
      score: BigInt(78),
      maxScore: BigInt(100),
      date: now - BigInt(2592000) * BigInt(1_000_000_000),
    },
    {
      id: BigInt(3),
      studentId: BigInt(1),
      subject: "Science",
      assessmentName: "Mid-Term",
      score: BigInt(92),
      maxScore: BigInt(100),
      date: now - BigInt(2592000) * BigInt(1_000_000_000),
    },
    {
      id: BigInt(4),
      studentId: BigInt(1),
      subject: "Urdu",
      assessmentName: "Mid-Term",
      score: BigInt(70),
      maxScore: BigInt(100),
      date: now - BigInt(2592000) * BigInt(1_000_000_000),
    },
    {
      id: BigInt(5),
      studentId: BigInt(1),
      subject: "Social Studies",
      assessmentName: "Mid-Term",
      score: BigInt(88),
      maxScore: BigInt(100),
      date: now - BigInt(2592000) * BigInt(1_000_000_000),
    },
  ],

  getMarksBySubject: async (_token, _subject) => [
    {
      id: BigInt(1),
      studentId: BigInt(1),
      subject: "Mathematics",
      assessmentName: "Final",
      score: BigInt(85),
      maxScore: BigInt(100),
      date: now,
    },
  ],

  getAttendanceByStudent: async (_token, _studentId) => [
    {
      id: BigInt(1),
      studentId: BigInt(1),
      status: AttendanceStatus.Present,
      date: now,
      markedBy: "TCH001",
    },
    {
      id: BigInt(2),
      studentId: BigInt(1),
      status: AttendanceStatus.Present,
      date: now - BigInt(86400) * BigInt(1_000_000_000),
      markedBy: "TCH001",
    },
    {
      id: BigInt(3),
      studentId: BigInt(1),
      status: AttendanceStatus.Absent,
      date: now - BigInt(172800) * BigInt(1_000_000_000),
      markedBy: "TCH001",
    },
  ],

  getAttendanceSummary: async (_token, _studentId) => ({
    studentId: BigInt(1),
    presentDays: BigInt(52),
    totalDays: BigInt(60),
    lateDays: BigInt(3),
    absentDays: BigInt(5),
  }),

  getAttendanceByClass: async (_token, _classId, _date) => [
    {
      id: BigInt(1),
      studentId: BigInt(1),
      status: AttendanceStatus.Present,
      date: now,
      markedBy: "TCH001",
    },
  ],

  listHomeworkByClass: async (_classId) => [
    {
      id: BigInt(1),
      title: "Chapter 5 Exercise",
      description: "Complete exercises 1-10 from Chapter 5 of Mathematics textbook.",
      classId: "Grade 5A",
      dueDate: now + BigInt(172800) * BigInt(1_000_000_000),
      createdAt: now,
      createdBy: "TCH001",
    },
    {
      id: BigInt(2),
      title: "Essay Writing",
      description: "Write a 200-word essay on 'My Favourite Season'.",
      classId: "Grade 5A",
      dueDate: now + BigInt(259200) * BigInt(1_000_000_000),
      createdAt: now,
      createdBy: "TCH002",
    },
  ],

  getSubmissions: async (_homeworkId) => [
    {
      studentId: BigInt(1),
      homeworkId: BigInt(1),
      status: SubmissionStatus.Submitted,
      submittedAt: now,
    },
  ],

  getStudent: async (_id) => ({
    id: BigInt(1),
    grNo: "GR001",
    name: "Aisha Malik",
    class: "Grade 5",
    section: "A",
    parentContact: "03001234567",
    photoUrl: "",
    createdAt: now,
  }),

  getTeacher: async (_id) => ({
    id: BigInt(1),
    teacherId: "TCH001",
    name: "Mr. Imran Ali",
    subjects: ["Mathematics", "Physics"],
    classesAssigned: ["Grade 5A", "Grade 6B"],
    createdAt: now,
  }),

  createStudent: async (_token, input) => ({
    id: BigInt(100),
    ...input,
    createdAt: now,
  }),

  createTeacher: async (_token, input) => ({
    id: BigInt(100),
    ...input,
    createdAt: now,
  }),

  createNotice: async (_token, input) => ({
    id: BigInt(100),
    title: input.title,
    content: input.content,
    createdBy: input.createdBy,
    audience: input.audience,
    classId: input.classId,
    createdAt: now,
  }),

  createFeeRecord: async (_token, input) => ({
    id: BigInt(100),
    ...input,
    status: FeeStatus.Unpaid,
  }),

  createHomework: async (_token, input) => ({
    id: BigInt(100),
    ...input,
    createdAt: now,
  }),

  addMark: async (_token, input) => ({
    id: BigInt(100),
    ...input,
  }),

  updateStudent: async (_token, _input) => null,
  updateTeacher: async (_token, _input) => null,
  updateFeeRecord: async (_token, _input) => null,
  updateMark: async (_token, _input) => null,

  deleteStudent: async (_token, _id) => true,
  deleteTeacher: async (_token, _id) => true,
  deleteNotice: async (_token, _id) => true,

  markAttendance: async (_token, input) => ({
    id: BigInt(100),
    ...input,
  }),

  markFeePaid: async (_token, _id, _paidDate) => null,

  markSubmission: async (_token, homeworkId, studentId) => ({
    homeworkId,
    studentId,
    status: SubmissionStatus.Submitted,
    submittedAt: now,
  }),
};
