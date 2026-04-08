// ─── Role & Auth ────────────────────────────────────────────────────────────

export type UserRole = "admin" | "teacher" | "student" | "unknown";

export type SessionToken = string;

export interface UserProfile {
  id: string;
  name: string;
  roleId: string;
  role: UserRole;
  createdAt?: bigint;
}

// ─── Student ─────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  grNo: string;
  name: string;
  className: string;
  section: string;
  parentName: string;
  contactNumber: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
  isActive: boolean;
}

export interface CreateStudentPayload {
  grNo: string;
  name: string;
  className: string;
  section: string;
  parentName: string;
  contactNumber: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
}

// ─── Teacher ─────────────────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  teacherId: string;
  name: string;
  subject: string;
  assignedClasses: string[];
  contactNumber: string;
  email: string;
  joinDate: string;
  isActive: boolean;
}

export interface CreateTeacherPayload {
  teacherId: string;
  name: string;
  subject: string;
  assignedClasses: string[];
  contactNumber: string;
  email: string;
  joinDate: string;
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

export type FeeStatus = "paid" | "unpaid" | "late" | "partial";

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  grNo: string;
  className: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  status: FeeStatus;
  feeType: string;
  month: string;
  year: number;
  remarks?: string;
}

export interface CreateFeePayload {
  studentId: string;
  amount: number;
  dueDate: string;
  feeType: string;
  month: string;
  year: number;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  remarks?: string;
}

export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

// ─── Homework ─────────────────────────────────────────────────────────────────

export interface Homework {
  id: string;
  title: string;
  description: string;
  className: string;
  subject: string;
  dueDate: string;
  assignedBy: string;
  createdAt: bigint;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submittedAt: bigint;
  remarks?: string;
  isLate: boolean;
}

// ─── Marks ───────────────────────────────────────────────────────────────────

export interface Mark {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  assessmentName: string;
  score: number;
  maxScore: number;
  className: string;
  date: string;
  remarks?: string;
  // Legacy aliases (may be present depending on backend version)
  examType?: string;
  grade?: string;
  marks?: number;
  maxMarks?: number;
}

export interface CreateMarkPayload {
  studentId: string;
  subject: string;
  assessmentName: string;
  score: number;
  maxScore: number;
  className: string;
  date: string;
  remarks?: string;
}

// ─── Notices ─────────────────────────────────────────────────────────────────

export type NoticeAudience = "all" | "admin" | "teacher" | "student";

export interface Notice {
  id: string;
  title: string;
  content: string;
  audience: NoticeAudience;
  createdBy: string;
  createdAt: bigint;
  isImportant: boolean;
}

export interface CreateNoticePayload {
  title: string;
  content: string;
  audience: NoticeAudience;
  isImportant: boolean;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  totalStudents: number;
  totalTeachers: number;
  feesCollected: number;
  totalFees: number;
  attendanceRate: number;
  enrollmentByClass: Array<{ className: string; count: number }>;
}
