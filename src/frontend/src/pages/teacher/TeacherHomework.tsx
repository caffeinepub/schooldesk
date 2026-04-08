import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import {
  useCreateHomework,
  useHomeworkByClass,
  useMarkSubmission,
  useStudents,
  useSubmissions,
  useTeachers,
} from "../../hooks/useBackend";
import type { Homework } from "../../types";

function SubmissionRow({
  homeworkId,
  studentId,
  studentName,
}: {
  homeworkId: string;
  studentId: string;
  studentName: string;
}) {
  const { data: submissions } = useSubmissions(homeworkId);
  const { mutateAsync: markSubmission, isPending } = useMarkSubmission();
  const isSubmitted = submissions?.some((s) => s.studentId === studentId);

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-foreground truncate flex-1 min-w-0 mr-2">
        {studentName}
      </span>
      {isSubmitted ? (
        <Badge
          variant="outline"
          className="text-accent border-accent/30 bg-accent/5 shrink-0"
        >
          Submitted
        </Badge>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs shrink-0"
          disabled={isPending}
          onClick={async () => {
            await markSubmission({ homeworkId, studentId });
            toast.success(`${studentName} marked as submitted`);
          }}
          data-ocid={`btn-mark-submission-${studentId}`}
        >
          Mark Done
        </Button>
      )}
    </div>
  );
}

function HomeworkCard({
  hw,
  classStudents,
}: {
  hw: Homework;
  classStudents: Array<{ id: string; name: string }>;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPastDue = new Date(hw.dueDate) < new Date();

  return (
    <div className="bg-card border border-border rounded-xl shadow-card role-teacher overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full p-4 text-left"
        data-ocid={`hw-expand-${hw.id}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              {hw.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {hw.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className={
                isPastDue
                  ? "text-destructive border-destructive/30 bg-destructive/5 text-xs"
                  : "text-accent border-accent/30 bg-accent/5 text-xs"
              }
            >
              {isPastDue ? "Overdue" : "Active"}
            </Badge>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Calendar size={11} />
          <span>Due: {new Date(hw.dueDate).toLocaleDateString("en-IN")}</span>
        </div>
      </button>

      {expanded && classStudents.length > 0 && (
        <div className="px-4 pb-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3 mb-2">
            Submissions
          </p>
          {classStudents.map((s) => (
            <SubmissionRow
              key={s.id}
              homeworkId={hw.id}
              studentId={s.id}
              studentName={s.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeacherHomework() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: teachers } = useTeachers();
  const { data: students } = useStudents();
  const { mutateAsync: createHomework, isPending } = useCreateHomework();

  const currentTeacher = teachers?.find(
    (t) => t.teacherId === userProfile?.roleId,
  );
  const assignedClasses = currentTeacher?.assignedClasses ?? [];
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0] ?? "");
  const [showForm, setShowForm] = useState(false);

  const { data: homework, isLoading } = useHomeworkByClass(selectedClass);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    subject: currentTeacher?.subject ?? "",
  });

  const classStudents = (students ?? [])
    .filter((s) => {
      const cls = `${s.className}-${s.section}`;
      return cls === selectedClass || s.className === selectedClass;
    })
    .map((s) => ({ id: s.id, name: s.name }));

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "profile") navigate({ to: "/teacher/profile" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueDate || !selectedClass) {
      toast.error("Please fill all required fields");
      return;
    }
    await createHomework({
      title: form.title,
      description: form.description,
      className: selectedClass,
      subject: form.subject,
      dueDate: form.dueDate,
      assignedBy: userProfile?.name ?? "Teacher",
    });
    toast.success("Homework assigned successfully");
    setForm({
      title: "",
      description: "",
      dueDate: "",
      subject: currentTeacher?.subject ?? "",
    });
    setShowForm(false);
  };

  return (
    <Layout activeTab="home" onTabChange={handleTabChange} title="Homework">
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

        {/* Add homework button */}
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="w-full"
          data-ocid="btn-add-homework"
        >
          {showForm ? (
            <>
              <X size={16} className="mr-2" /> Cancel
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" /> Assign Homework
            </>
          )}
        </Button>

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-xl p-4 shadow-card space-y-3"
          >
            <h3 className="font-display font-semibold text-sm text-foreground">
              New Homework
            </h3>
            <div className="space-y-1">
              <Label htmlFor="hw-title" className="text-xs">
                Title *
              </Label>
              <Input
                id="hw-title"
                placeholder="e.g. Chapter 5 Exercise"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                data-ocid="input-hw-title"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hw-desc" className="text-xs">
                Description
              </Label>
              <Textarea
                id="hw-desc"
                placeholder="Assignment details..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                data-ocid="input-hw-desc"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="hw-subject" className="text-xs">
                  Subject
                </Label>
                <Input
                  id="hw-subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  data-ocid="input-hw-subject"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hw-due" className="text-xs">
                  Due Date *
                </Label>
                <Input
                  id="hw-due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dueDate: e.target.value }))
                  }
                  data-ocid="input-hw-due"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              data-ocid="btn-submit-homework"
            >
              {isPending ? "Saving…" : "Assign"}
            </Button>
          </form>
        )}

        {/* Homework list */}
        {isLoading ? (
          <PageLoader />
        ) : !selectedClass ? (
          <EmptyState
            icon={BookOpen}
            title="No class selected"
            description="Select a class to view or assign homework."
            data-ocid="empty-no-class"
          />
        ) : homework && homework.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No homework yet"
            description="Assign homework for this class using the button above."
            data-ocid="empty-homework"
          />
        ) : (
          <div className="space-y-3">
            {(homework ?? []).map((hw) => (
              <HomeworkCard key={hw.id} hw={hw} classStudents={classStudents} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
