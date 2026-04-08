import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MarkAttendanceInput {
    status: AttendanceStatus;
    studentId: StudentId;
    date: Timestamp;
    markedBy: string;
}
export type Timestamp = bigint;
export interface EnrollmentByClass {
    classId: string;
    studentCount: bigint;
}
export interface CreateFeeInput {
    studentId: StudentId;
    lateFeeAmount: bigint;
    dueDate: Timestamp;
    amount: bigint;
    receiptNumber: string;
}
export type AttendanceId = bigint;
export interface Teacher {
    id: TeacherId;
    classesAssigned: Array<string>;
    subjects: Array<string>;
    name: string;
    createdAt: Timestamp;
    teacherId: string;
}
export interface UpdateStudentInput {
    id: StudentId;
    parentContact: string;
    grNo: string;
    class: string;
    name: string;
    section: string;
    photoUrl: string;
}
export interface CreateNoticeInput {
    title: string;
    content: string;
    createdBy: string;
    audience: Audience;
    classId?: string;
}
export type MarkId = bigint;
export interface FeeRecord {
    id: FeeId;
    status: FeeStatus;
    studentId: StudentId;
    lateFeeAmount: bigint;
    dueDate: Timestamp;
    paidDate?: Timestamp;
    amount: bigint;
    receiptNumber: string;
}
export type FeeId = bigint;
export interface UpdateMarkInput {
    id: MarkId;
    maxScore: bigint;
    assessmentName: string;
    score: bigint;
}
export interface FeesCollectionSummary {
    lateAmount: bigint;
    totalAmount: bigint;
    pendingAmount: bigint;
    collectedAmount: bigint;
}
export interface Notice {
    id: NoticeId;
    title: string;
    content: string;
    createdAt: Timestamp;
    createdBy: string;
    audience: Audience;
    classId?: string;
}
export interface Mark {
    id: MarkId;
    studentId: StudentId;
    maxScore: bigint;
    subject: string;
    date: Timestamp;
    assessmentName: string;
    score: bigint;
}
export interface Homework {
    id: HomeworkId;
    title: string;
    createdAt: Timestamp;
    createdBy: string;
    dueDate: Timestamp;
    description: string;
    classId: string;
}
export type NoticeId = bigint;
export interface AttendanceRecord {
    id: AttendanceId;
    status: AttendanceStatus;
    studentId: StudentId;
    date: Timestamp;
    markedBy: string;
}
export interface Student {
    id: StudentId;
    parentContact: string;
    grNo: string;
    class: string;
    name: string;
    createdAt: Timestamp;
    section: string;
    photoUrl: string;
}
export interface HomeworkSubmission {
    status: SubmissionStatus;
    studentId: StudentId;
    homeworkId: HomeworkId;
    submittedAt: Timestamp;
}
export interface CreateStudentInput {
    parentContact: string;
    grNo: string;
    class: string;
    name: string;
    section: string;
    photoUrl: string;
}
export interface CreateTeacherInput {
    classesAssigned: Array<string>;
    subjects: Array<string>;
    name: string;
    teacherId: string;
}
export interface UpdateFeeInput {
    id: FeeId;
    status: FeeStatus;
    lateFeeAmount: bigint;
    dueDate: Timestamp;
    amount: bigint;
    receiptNumber: string;
}
export interface AttendanceSummary {
    studentId: StudentId;
    presentDays: bigint;
    totalDays: bigint;
    lateDays: bigint;
    absentDays: bigint;
}
export interface AttendanceRateSummary {
    presentCount: bigint;
    attendanceRate: bigint;
    lateCount: bigint;
    totalRecords: bigint;
    absentCount: bigint;
}
export type StudentId = bigint;
export type TeacherId = bigint;
export type HomeworkId = bigint;
export interface CreateHomeworkInput {
    title: string;
    createdBy: string;
    dueDate: Timestamp;
    description: string;
    classId: string;
}
export type AddUserResult = {
    __kind__: "ok";
    ok: UserProfile;
} | {
    __kind__: "err";
    err: string;
};
export interface AddUserInput {
    username: string;
    password: string;
    name: string;
    roleId: string;
}
export type LoginResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface UpdateTeacherInput {
    id: TeacherId;
    classesAssigned: Array<string>;
    subjects: Array<string>;
    name: string;
    teacherId: string;
}
export interface UserProfile {
    id: string;
    username: string;
    name: string;
    createdAt: Timestamp;
    role: Role;
    roleId: string;
}
export interface AddMarkInput {
    studentId: StudentId;
    maxScore: bigint;
    subject: string;
    date: Timestamp;
    assessmentName: string;
    score: bigint;
}
export enum AttendanceStatus {
    Present = "Present",
    Late = "Late",
    Absent = "Absent"
}
export enum Audience {
    All = "All",
    Teacher = "Teacher",
    Student = "Student",
    Admin = "Admin",
    Class = "Class"
}
export enum FeeStatus {
    Late = "Late",
    Paid = "Paid",
    Unpaid = "Unpaid"
}
export enum Role {
    Teacher = "Teacher",
    Student = "Student",
    Admin = "Admin"
}
export enum SubmissionStatus {
    Submitted = "Submitted",
    Pending = "Pending"
}
export interface backendInterface {
    addMark(token: string, input: AddMarkInput): Promise<Mark>;
    addUser(token: string, input: AddUserInput): Promise<AddUserResult>;
    createFeeRecord(token: string, input: CreateFeeInput): Promise<FeeRecord>;
    createHomework(token: string, input: CreateHomeworkInput): Promise<Homework>;
    createNotice(token: string, input: CreateNoticeInput): Promise<Notice>;
    createStudent(token: string, input: CreateStudentInput): Promise<Student>;
    createTeacher(token: string, input: CreateTeacherInput): Promise<Teacher>;
    deleteNotice(token: string, id: NoticeId): Promise<boolean>;
    deleteStudent(token: string, id: StudentId): Promise<boolean>;
    deleteTeacher(token: string, id: TeacherId): Promise<boolean>;
    getAttendanceByClass(token: string, classId: string, date: Timestamp): Promise<Array<AttendanceRecord>>;
    getAttendanceByStudent(token: string, studentId: StudentId): Promise<Array<AttendanceRecord>>;
    getAttendanceRateSummary(): Promise<AttendanceRateSummary>;
    getAttendanceSummary(token: string, studentId: StudentId): Promise<AttendanceSummary>;
    getEnrollmentByClass(): Promise<Array<EnrollmentByClass>>;
    getFeesCollectionSummary(): Promise<FeesCollectionSummary>;
    getMarksByStudent(token: string, studentId: StudentId): Promise<Array<Mark>>;
    getMarksBySubject(token: string, subject: string): Promise<Array<Mark>>;
    getStudent(id: StudentId): Promise<Student | null>;
    getSubmissions(homeworkId: HomeworkId): Promise<Array<HomeworkSubmission>>;
    getTeacher(id: TeacherId): Promise<Teacher | null>;
    getTotalStudents(): Promise<bigint>;
    getTotalTeachers(): Promise<bigint>;
    listAllFees(): Promise<Array<FeeRecord>>;
    listFeesByStudent(studentId: StudentId): Promise<Array<FeeRecord>>;
    listHomeworkByClass(classId: string): Promise<Array<Homework>>;
    listNotices(audience: Audience | null, classId: string | null): Promise<Array<Notice>>;
    listStudents(): Promise<Array<Student>>;
    listTeachers(): Promise<Array<Teacher>>;
    login(username: string, password: string): Promise<LoginResult>;
    logout(token: string): Promise<void>;
    markAttendance(token: string, input: MarkAttendanceInput): Promise<AttendanceRecord>;
    markFeePaid(token: string, id: FeeId, paidDate: Timestamp): Promise<FeeRecord | null>;
    markSubmission(token: string, homeworkId: HomeworkId, studentId: StudentId): Promise<HomeworkSubmission>;
    updateFeeRecord(token: string, input: UpdateFeeInput): Promise<FeeRecord | null>;
    updateMark(token: string, input: UpdateMarkInput): Promise<Mark | null>;
    updateStudent(token: string, input: UpdateStudentInput): Promise<Student | null>;
    updateTeacher(token: string, input: UpdateTeacherInput): Promise<Teacher | null>;
    validateSession(token: string): Promise<UserProfile | null>;
}
