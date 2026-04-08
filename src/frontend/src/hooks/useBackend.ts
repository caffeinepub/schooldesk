import { useActor as useCaffeineActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  AnalyticsSummary,
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  FeeRecord,
  FeeStatus,
  Homework,
  HomeworkSubmission,
  Mark,
  Notice,
  NoticeAudience,
  Student,
  Teacher,
  UserProfile,
} from "../types";

// ─── Actor hook ──────────────────────────────────────────────────────────────

type ActorMethods = Record<string, (...args: unknown[]) => Promise<unknown>>;

function useBackendActor() {
  const { actor, isFetching } = useCaffeineActor(createActor);
  return {
    actor: actor as unknown as ActorMethods | null,
    isFetching,
  };
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export function useMyProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getMyProfile();
      return (result as { ok?: UserProfile; err?: string })?.ok ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterOrLogin() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({ roleId, name }: { roleId: string; name: string }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.registerOrLogin({ roleId, name });
      return (result as { ok?: UserProfile; err?: string })?.ok ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ─── Students ────────────────────────────────────────────────────────────────

export function useStudents() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listStudents();
      return (result as Student[]) ?? [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudent(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Student | null>({
    queryKey: ["student", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      const result = await actor.getStudent(id);
      return (result as { ok?: Student; err?: string })?.ok ?? null;
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (!actor) throw new Error("No actor");
      return actor.createStudent(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: { id: string; payload: Record<string, unknown> }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateStudent(id, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteStudent(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });
}

// ─── Teachers ────────────────────────────────────────────────────────────────

export function useTeachers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listTeachers();
      return (result as Teacher[]) ?? [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTeacher(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Teacher | null>({
    queryKey: ["teacher", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      const result = await actor.getTeacher(id);
      return (result as { ok?: Teacher; err?: string })?.ok ?? null;
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (!actor) throw new Error("No actor");
      return actor.createTeacher(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: { id: string; payload: Record<string, unknown> }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateTeacher(id, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteTeacher(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

export function useFeesByStudent(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeeRecord[]>({
    queryKey: ["fees", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      const result = await actor.listFeesByStudent(studentId);
      return (result as FeeRecord[]) ?? [];
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useAllFees() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeeRecord[]>({
    queryKey: ["fees", "all"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listAllFees();
      return (result as FeeRecord[]) ?? [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFeeRecord() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (!actor) throw new Error("No actor");
      return actor.createFeeRecord(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fees"] }),
  });
}

export function useMarkFeePaid() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      id,
      paidAmount,
    }: { id: string; paidAmount: number }) => {
      if (!actor) throw new Error("No actor");
      return actor.markFeePaid(id, paidAmount);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fees"] }),
  });
}

export function useUpdateFeeRecord() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: FeeStatus }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateFeeRecord(id, status);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fees"] }),
  });
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export function useAttendanceByStudent(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AttendanceRecord[]>({
    queryKey: ["attendance", "student", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      const result = await actor.getAttendanceByStudent(studentId);
      return (result as AttendanceRecord[]) ?? [];
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useAttendanceByClass(className: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AttendanceRecord[]>({
    queryKey: ["attendance", "class", className],
    queryFn: async () => {
      if (!actor || !className) return [];
      const result = await actor.getAttendanceByClass(className);
      return (result as AttendanceRecord[]) ?? [];
    },
    enabled: !!actor && !isFetching && !!className,
  });
}

export function useAttendanceSummary(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AttendanceSummary | null>({
    queryKey: ["attendance", "summary", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return null;
      const result = await actor.getAttendanceSummary(studentId);
      return (result as AttendanceSummary) ?? null;
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      studentId,
      date,
      status,
      remarks,
    }: {
      studentId: string;
      date: string;
      status: AttendanceStatus;
      remarks?: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.markAttendance(studentId, date, status, remarks ?? "");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });
}

// ─── Homework ─────────────────────────────────────────────────────────────────

export function useHomeworkByClass(className: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Homework[]>({
    queryKey: ["homework", className],
    queryFn: async () => {
      if (!actor || !className) return [];
      const result = await actor.listHomeworkByClass(className);
      return (result as Homework[]) ?? [];
    },
    enabled: !!actor && !isFetching && !!className,
  });
}

export function useCreateHomework() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (!actor) throw new Error("No actor");
      return actor.createHomework(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homework"] }),
  });
}

export function useMarkSubmission() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      homeworkId,
      studentId,
      remarks,
    }: { homeworkId: string; studentId: string; remarks?: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.markSubmission(homeworkId, studentId, remarks ?? "");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["submissions"] }),
  });
}

export function useSubmissions(homeworkId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<HomeworkSubmission[]>({
    queryKey: ["submissions", homeworkId],
    queryFn: async () => {
      if (!actor || !homeworkId) return [];
      const result = await actor.getSubmissions(homeworkId);
      return (result as HomeworkSubmission[]) ?? [];
    },
    enabled: !!actor && !isFetching && !!homeworkId,
  });
}

// ─── Marks ───────────────────────────────────────────────────────────────────

export function useMarksByStudent(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Mark[]>({
    queryKey: ["marks", "student", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      const result = await actor.getMarksByStudent(studentId);
      return (result as Mark[]) ?? [];
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useMarksBySubject(subject: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Mark[]>({
    queryKey: ["marks", "subject", subject],
    queryFn: async () => {
      if (!actor || !subject) return [];
      const result = await actor.getMarksBySubject(subject);
      return (result as Mark[]) ?? [];
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useAddMark() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (!actor) throw new Error("No actor");
      return actor.addMark(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["marks"] }),
  });
}

export function useUpdateMark() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: { id: string; payload: Record<string, unknown> }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateMark(id, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["marks"] }),
  });
}

// ─── Notices ─────────────────────────────────────────────────────────────────

export function useNotices() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Notice[]>({
    queryKey: ["notices"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listNotices();
      return (result as Notice[]) ?? [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      content: string;
      audience: NoticeAudience;
      isImportant: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createNotice(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteNotice(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function useAnalytics() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AnalyticsSummary>({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalStudents: 0,
          totalTeachers: 0,
          feesCollected: 0,
          totalFees: 0,
          attendanceRate: 0,
          enrollmentByClass: [],
        };
      }
      const [
        totalStudents,
        totalTeachers,
        feesSummary,
        attendanceRate,
        enrollmentByClass,
      ] = await Promise.all([
        actor.getTotalStudents(),
        actor.getTotalTeachers(),
        actor.getFeesCollectionSummary(),
        actor.getAttendanceRateSummary(),
        actor.getEnrollmentByClass(),
      ]);
      const fees = feesSummary as {
        collectedAmount: bigint;
        totalAmount: bigint;
      };
      return {
        totalStudents: (totalStudents as number) ?? 0,
        totalTeachers: (totalTeachers as number) ?? 0,
        feesCollected: fees?.collectedAmount ? Number(fees.collectedAmount) : 0,
        totalFees: fees?.totalAmount ? Number(fees.totalAmount) : 0,
        attendanceRate: (attendanceRate as number) ?? 0,
        enrollmentByClass:
          (
            enrollmentByClass as Array<{
              classId: string;
              studentCount: bigint;
            }>
          )?.map((e) => ({
            className: e.classId,
            count: Number(e.studentCount),
          })) ?? [],
      };
    },
    enabled: !!actor && !isFetching,
  });
}
