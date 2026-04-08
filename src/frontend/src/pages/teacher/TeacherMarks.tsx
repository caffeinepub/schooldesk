import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Plus, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import {
  useAddMark,
  useMarksByStudent,
  useStudents,
  useTeachers,
} from "../../hooks/useBackend";
import type { Student } from "../../types";

const EXAM_TYPES = ["Unit Test", "Mid-Term", "Final", "Assignment", "Quiz"];

function StudentRow({
  student,
  onSelect,
}: {
  student: Student;
  onSelect: () => void;
}) {
  const { data: marks } = useMarksByStudent(student.id);
  const avg =
    marks && marks.length > 0
      ? Math.round(
          marks.reduce((sum, m) => {
            const score = m.score ?? m.marks ?? 0;
            const max = m.maxScore ?? m.maxMarks ?? 0;
            return sum + (max > 0 ? (score / max) * 100 : 0);
          }, 0) / marks.length,
        )
      : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full bg-card border border-border rounded-xl p-3.5 shadow-card flex items-center justify-between hover:shadow-elevated transition-smooth"
      data-ocid={`student-row-${student.id}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-accent">
            {student.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">
            {student.name}
          </p>
          <p className="text-xs text-muted-foreground">GR: {student.grNo}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {avg !== null && (
          <Badge
            variant="outline"
            className={`text-xs ${avg >= 75 ? "text-accent border-accent/30" : avg >= 50 ? "text-foreground border-border" : "text-destructive border-destructive/30"}`}
          >
            {avg}%
          </Badge>
        )}
        <ChevronRight size={16} className="text-muted-foreground" />
      </div>
    </button>
  );
}

function StudentMarksView({
  student,
  subject,
  onBack,
  className,
}: {
  student: Student;
  subject: string;
  onBack: () => void;
  className: string;
}) {
  const { data: marks, isLoading } = useMarksByStudent(student.id);
  const { mutateAsync: addMark, isPending } = useAddMark();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    subject,
    examType: "Unit Test",
    marks: "",
    maxMarks: "100",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const marksNum = Number.parseFloat(form.marks);
    const maxMarksNum = Number.parseFloat(form.maxMarks);
    if (
      Number.isNaN(marksNum) ||
      Number.isNaN(maxMarksNum) ||
      marksNum > maxMarksNum
    ) {
      toast.error("Invalid marks values");
      return;
    }
    await addMark({
      studentId: student.id,
      subject: form.subject,
      assessmentName: form.examType,
      score: marksNum,
      maxScore: maxMarksNum,
      className,
      date: form.date,
      remarks: form.remarks,
    });
    toast.success("Marks saved");
    setShowForm(false);
    setForm({
      subject,
      examType: "Unit Test",
      marks: "",
      maxMarks: "100",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
    });
  };

  const gradeColor = (m: number, max: number) => {
    const pct = (m / max) * 100;
    if (pct >= 75) return "text-accent";
    if (pct >= 50) return "text-foreground";
    return "text-destructive";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-accent font-semibold"
          data-ocid="btn-back-to-students"
        >
          ← All Students
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-semibold text-foreground truncate">
          {student.name}
        </span>
      </div>

      <Button
        onClick={() => setShowForm((v) => !v)}
        className="w-full"
        data-ocid="btn-add-mark"
      >
        {showForm ? (
          <>
            <X size={16} className="mr-2" /> Cancel
          </>
        ) : (
          <>
            <Plus size={16} className="mr-2" /> Add Marks
          </>
        )}
      </Button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-xl p-4 shadow-card space-y-3"
        >
          <h3 className="font-display font-semibold text-sm text-foreground">
            Enter Marks
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="m-subject" className="text-xs">
                Subject
              </Label>
              <Input
                id="m-subject"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                data-ocid="input-mark-subject"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="m-exam" className="text-xs">
                Exam Type
              </Label>
              <select
                id="m-exam"
                value={form.examType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, examType: e.target.value }))
                }
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="select-exam-type"
              >
                {EXAM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="m-score" className="text-xs">
                Score *
              </Label>
              <Input
                id="m-score"
                type="number"
                min="0"
                placeholder="0"
                value={form.marks}
                onChange={(e) =>
                  setForm((f) => ({ ...f, marks: e.target.value }))
                }
                data-ocid="input-mark-score"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="m-max" className="text-xs">
                Max Score *
              </Label>
              <Input
                id="m-max"
                type="number"
                min="1"
                placeholder="100"
                value={form.maxMarks}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxMarks: e.target.value }))
                }
                data-ocid="input-mark-max"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="m-date" className="text-xs">
                Date
              </Label>
              <Input
                id="m-date"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                data-ocid="input-mark-date"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="m-remarks" className="text-xs">
                Remarks
              </Label>
              <Input
                id="m-remarks"
                placeholder="Optional"
                value={form.remarks}
                onChange={(e) =>
                  setForm((f) => ({ ...f, remarks: e.target.value }))
                }
                data-ocid="input-mark-remarks"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            data-ocid="btn-submit-mark"
          >
            {isPending ? "Saving…" : "Save Marks"}
          </Button>
        </form>
      )}

      {isLoading ? (
        <PageLoader />
      ) : !marks || marks.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No marks yet"
          description="Add marks using the button above."
          data-ocid="empty-student-marks"
        />
      ) : (
        <div className="space-y-2">
          {marks.map((m) => {
            const score = m.score ?? m.marks ?? 0;
            const maxScore = m.maxScore ?? m.maxMarks ?? 0;
            const label = m.assessmentName ?? m.examType ?? "";
            const dateStr = (() => {
              const raw = m.date as unknown;
              if (typeof raw === "bigint")
                return new Date(Number(raw) / 1_000_000).toLocaleDateString(
                  "en-IN",
                );
              return new Date(m.date).toLocaleDateString("en-IN");
            })();
            return (
              <div
                key={m.id}
                className="bg-card border border-border rounded-xl p-3.5 shadow-card role-teacher"
                data-ocid={`mark-row-${m.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {m.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {label} · {dateStr}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-display font-bold ${gradeColor(score, maxScore)}`}
                    >
                      {score}/{maxScore}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {maxScore > 0 ? Math.round((score / maxScore) * 100) : 0}%
                    </p>
                  </div>
                </div>
                {m.remarks && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    {m.remarks}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TeacherMarks() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: teachers } = useTeachers();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const currentTeacher = teachers?.find(
    (t) => t.teacherId === userProfile?.roleId,
  );
  const assignedClasses = currentTeacher?.assignedClasses ?? [];

  // Auto-select first class
  const activeClass = selectedClass || assignedClasses[0] || "";

  const classStudents = (students ?? []).filter((s) => {
    const cls = `${s.className}-${s.section}`;
    return cls === activeClass || s.className === activeClass;
  });

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "profile") navigate({ to: "/teacher/profile" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };

  return (
    <Layout activeTab="home" onTabChange={handleTabChange} title="Marks">
      <div className="px-4 pt-4 pb-4 space-y-4">
        {/* Class selector */}
        {assignedClasses.length > 0 && !selectedStudent && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {assignedClasses.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth ${
                  activeClass === cls
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

        {selectedStudent ? (
          <StudentMarksView
            student={selectedStudent}
            subject={currentTeacher?.subject ?? ""}
            onBack={() => setSelectedStudent(null)}
            className={activeClass}
          />
        ) : studentsLoading ? (
          <PageLoader />
        ) : classStudents.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No students found"
            description={
              activeClass
                ? "No students in this class."
                : "Select a class to view students."
            }
            data-ocid="empty-marks"
          />
        ) : (
          <div className="space-y-2">
            {classStudents.map((s) => (
              <StudentRow
                key={s.id}
                student={s}
                onSelect={() => setSelectedStudent(s)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
