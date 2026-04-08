import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { CalendarCheck, ChevronDown, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { StatusBadge } from "../../components/StatusBadge";
import {
  useAttendanceByClass,
  useMarkAttendance,
  useStudents,
} from "../../hooks/useBackend";
import type { AttendanceStatus, Student } from "../../types";

const CLASS_OPTIONS = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
];

const STATUS_BTNS: { id: AttendanceStatus; label: string; active: string }[] = [
  { id: "present", label: "P", active: "bg-accent text-accent-foreground" },
  {
    id: "absent",
    label: "A",
    active: "bg-destructive text-destructive-foreground",
  },
  { id: "late", label: "L", active: "bg-[oklch(0.65_0.18_55)] text-white" },
];

type AttendanceMap = Record<string, AttendanceStatus>;

export default function AdminAttendance() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[5]);
  const [date, setDate] = useState(today);
  const [attendanceMap, setAttendanceMap] = useState<AttendanceMap>({});
  const [saving, setSaving] = useState(false);

  const { data: allStudents = [] } = useStudents();
  const { data: existingRecords = [], isLoading } =
    useAttendanceByClass(selectedClass);
  const markAttendance = useMarkAttendance();

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };

  const classStudents: Student[] = useMemo(
    () =>
      allStudents.filter((s) => s.className === selectedClass && s.isActive),
    [allStudents, selectedClass],
  );

  // Pre-fill from existing records for the selected date
  useMemo(() => {
    const map: AttendanceMap = {};
    for (const r of existingRecords) {
      if (r.date === date) {
        map[r.studentId] = r.status;
      }
    }
    setAttendanceMap(map);
  }, [existingRecords, date]);

  const summary = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0 };
    for (const s of classStudents) {
      const st = attendanceMap[s.id] ?? "absent";
      if (st === "present") counts.present++;
      else if (st === "absent") counts.absent++;
      else if (st === "late") counts.late++;
    }
    return counts;
  }, [classStudents, attendanceMap]);

  async function handleSave() {
    if (classStudents.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        classStudents.map((s) =>
          markAttendance.mutateAsync({
            studentId: s.id,
            date,
            status: attendanceMap[s.id] ?? "absent",
          }),
        ),
      );
      toast.success(`Attendance saved for ${selectedClass}`);
    } catch {
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout activeTab="home" onTabChange={handleTabChange} title="Attendance">
      <div className="px-4 pt-4 pb-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Mark daily attendance by class
        </p>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-medium mb-1 block">Class</Label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full appearance-none bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8"
                data-ocid="select-class"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="att-date"
              className="text-xs font-medium mb-1 block"
            >
              Date
            </Label>
            <Input
              id="att-date"
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              data-ocid="input-att-date"
            />
          </div>
        </div>

        {/* Summary strip */}
        {classStudents.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 shadow-card">
            <CalendarCheck size={15} className="text-primary flex-shrink-0" />
            <div className="flex-1 flex items-center gap-4 text-xs font-semibold">
              <span className="text-accent">P: {summary.present}</span>
              <span className="text-destructive">A: {summary.absent}</span>
              <span className="text-[oklch(0.55_0.18_55)]">
                L: {summary.late}
              </span>
              <span className="text-muted-foreground ml-auto font-normal">
                of {classStudents.length}
              </span>
            </div>
          </div>
        )}

        {/* Student list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner label="Loading attendance…" />
          </div>
        ) : classStudents.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No students in this class"
            description="Students enrolled in the selected class will appear here."
            data-ocid="empty-attendance"
          />
        ) : (
          <>
            <div className="space-y-2" data-ocid="attendance-list">
              {classStudents.map((s, idx) => {
                const status = attendanceMap[s.id] ?? null;
                return (
                  <div
                    key={s.id}
                    className="bg-card rounded-xl border border-border shadow-card px-4 py-3 flex items-center gap-3"
                    data-ocid={`attendance-row-${s.id}`}
                  >
                    <span className="w-6 text-xs text-muted-foreground font-mono flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.grNo}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {STATUS_BTNS.map(({ id, label, active }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() =>
                            setAttendanceMap((m) => ({ ...m, [s.id]: id }))
                          }
                          aria-label={id}
                          data-ocid={`att-${id}-${s.id}`}
                          className={cn(
                            "w-8 h-8 rounded-full text-xs font-bold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            status === id
                              ? cn(active, "scale-110 shadow-sm")
                              : "bg-muted text-muted-foreground hover:bg-secondary",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {status && <StatusBadge status={status} />}
                  </div>
                );
              })}
            </div>

            <Button
              className="w-full"
              onClick={handleSave}
              disabled={saving}
              data-ocid="btn-save-attendance"
            >
              <Save size={15} className="mr-2" />
              {saving ? "Saving…" : `Save Attendance · ${selectedClass}`}
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}
