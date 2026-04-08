import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ClipboardCheck, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import {
  useAttendanceByClass,
  useMarkAttendance,
  useStudents,
  useTeachers,
} from "../../hooks/useBackend";
import type { AttendanceStatus, Student } from "../../types";

type LocalStatus = AttendanceStatus | "none";

interface AttendanceEntry {
  studentId: string;
  studentName: string;
  status: LocalStatus;
}

const STATUS_CONFIG: Record<
  Exclude<LocalStatus, "none">,
  {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    classes: string;
  }
> = {
  present: {
    label: "P",
    icon: CheckCircle2,
    classes: "bg-accent/10 text-accent border-accent/30",
  },
  absent: {
    label: "A",
    icon: XCircle,
    classes: "bg-destructive/10 text-destructive border-destructive/30",
  },
  late: {
    label: "L",
    icon: Clock,
    classes: "bg-primary/10 text-primary border-primary/30",
  },
  excused: {
    label: "E",
    icon: CheckCircle2,
    classes: "bg-muted text-muted-foreground border-border",
  },
};

export default function TeacherAttendance() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: teachers } = useTeachers();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { mutateAsync: markAttendance, isPending: saving } =
    useMarkAttendance();

  const currentTeacher = teachers?.find(
    (t) => t.teacherId === userProfile?.roleId,
  );
  const assignedClasses = currentTeacher?.assignedClasses ?? [];

  const [selectedClass, setSelectedClass] = useState(assignedClasses[0] ?? "");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [saved, setSaved] = useState(false);

  const { data: existingAttendance, isLoading: attLoading } =
    useAttendanceByClass(selectedClass);

  const classStudents: Student[] = (students ?? []).filter((s) => {
    const cls = `${s.className}-${s.section}`;
    return cls === selectedClass || s.className === selectedClass;
  });

  // Build entries from students + existing attendance
  // classStudents is re-derived each render; use students + selectedClass as stable deps
  useEffect(() => {
    const filtered = (students ?? []).filter((s) => {
      const cls = `${s.className}-${s.section}`;
      return cls === selectedClass || s.className === selectedClass;
    });
    if (!filtered.length) return;
    const dateRecords = (existingAttendance ?? []).filter(
      (a) => a.date === selectedDate,
    );
    setEntries(
      filtered.map((s) => {
        const existing = dateRecords.find((a) => a.studentId === s.id);
        return {
          studentId: s.id,
          studentName: s.name,
          status: existing ? existing.status : "none",
        };
      }),
    );
    setSaved(false);
  }, [students, selectedClass, selectedDate, existingAttendance]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setEntries((prev) =>
      prev.map((e) => (e.studentId === studentId ? { ...e, status } : e)),
    );
    setSaved(false);
  };

  const markAll = (status: AttendanceStatus) => {
    setEntries((prev) => prev.map((e) => ({ ...e, status })));
    setSaved(false);
  };

  const handleSave = async () => {
    const unmarked = entries.filter((e) => e.status === "none");
    if (unmarked.length > 0) {
      toast.error(`${unmarked.length} student(s) not marked`);
      return;
    }
    await Promise.all(
      entries.map((e) =>
        markAttendance({
          studentId: e.studentId,
          date: selectedDate,
          status: e.status as AttendanceStatus,
        }),
      ),
    );
    toast.success("Attendance saved");
    setSaved(true);
  };

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "profile") navigate({ to: "/teacher/profile" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };

  const presentCount = entries.filter((e) => e.status === "present").length;
  const absentCount = entries.filter((e) => e.status === "absent").length;
  const lateCount = entries.filter((e) => e.status === "late").length;

  const isLoading = studentsLoading || attLoading;

  return (
    <Layout activeTab="home" onTabChange={handleTabChange} title="Attendance">
      <div className="px-4 pt-4 pb-4 space-y-4">
        {/* Class selector */}
        {assignedClasses.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {assignedClasses.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth ${
                  selectedClass === cls
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-card text-muted-foreground border-border hover:border-accent/50"
                }`}
                data-ocid={`class-tab-${cls}`}
              >
                {cls}
              </button>
            ))}
          </div>
        )}

        {/* Date selector */}
        <div className="bg-card border border-border rounded-xl p-3.5 shadow-card">
          <label
            htmlFor="attendance-date"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5"
          >
            Date
          </label>
          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            data-ocid="input-attendance-date"
          />
        </div>

        {isLoading ? (
          <PageLoader />
        ) : !selectedClass ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No class selected"
            description="You have no assigned classes."
            data-ocid="empty-no-class"
          />
        ) : classStudents.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No students found"
            description="No students enrolled in this class."
            data-ocid="empty-attendance"
          />
        ) : (
          <>
            {/* Summary */}
            {entries.some((e) => e.status !== "none") && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-2.5 text-center">
                  <p className="text-lg font-display font-bold text-accent">
                    {presentCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-2.5 text-center">
                  <p className="text-lg font-display font-bold text-destructive">
                    {absentCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 text-center">
                  <p className="text-lg font-display font-bold text-primary">
                    {lateCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </div>
            )}

            {/* Bulk actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                Mark all:
              </span>
              <button
                type="button"
                onClick={() => markAll("present")}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20"
                data-ocid="btn-all-present"
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => markAll("absent")}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20"
                data-ocid="btn-all-absent"
              >
                Absent
              </button>
            </div>

            {/* Student list */}
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.studentId}
                  className="bg-card border border-border rounded-xl p-3 shadow-card flex items-center justify-between"
                  data-ocid={`att-row-${entry.studentId}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-accent">
                        {entry.studentName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground truncate max-w-[130px]">
                      {entry.studentName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {(["present", "absent", "late"] as AttendanceStatus[]).map(
                      (status) => {
                        const config = STATUS_CONFIG[status];
                        const isActive = entry.status === status;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setStatus(entry.studentId, status)}
                            className={`w-8 h-8 rounded-full border text-xs font-bold transition-smooth ${
                              isActive
                                ? config.classes
                                : "bg-muted text-muted-foreground border-border hover:border-accent/40"
                            }`}
                            aria-label={`Mark ${entry.studentName} as ${status}`}
                            data-ocid={`btn-${status}-${entry.studentId}`}
                          >
                            {config.label}
                          </button>
                        );
                      },
                    )}
                    {entry.status !== "none" &&
                      entry.status !== "present" &&
                      entry.status !== "absent" &&
                      entry.status !== "late" && (
                        <Badge variant="outline" className="text-xs">
                          {entry.status}
                        </Badge>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Save button */}
            <Button
              onClick={handleSave}
              disabled={saving || saved}
              className="w-full"
              data-ocid="btn-save-attendance"
            >
              {saving
                ? "Saving…"
                : saved
                  ? "Attendance Saved ✓"
                  : "Save Attendance"}
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}
