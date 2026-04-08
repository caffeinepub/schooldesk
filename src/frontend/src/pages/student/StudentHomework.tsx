import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import {
  useHomeworkByClass,
  useMarkSubmission,
  useStudents,
  useSubmissions,
} from "../../hooks/useBackend";
import type { Homework } from "../../types";

function isDueSoon(dueDate: string): boolean {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 2;
}

function isPastDue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

function HomeworkCard({
  hw,
  studentId,
  studentClass,
}: {
  hw: Homework;
  studentId: string;
  studentClass: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { data: submissions } = useSubmissions(hw.id);
  const markSubmission = useMarkSubmission();

  const isSubmitted = (submissions ?? []).some(
    (s) => s.studentId === studentId,
  );
  const dueSoon = isDueSoon(hw.dueDate);
  const overdue = isPastDue(hw.dueDate);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await markSubmission.mutateAsync({
        homeworkId: hw.id,
        studentId,
        remarks: "",
      });
      toast.success(`"${hw.title}" marked as submitted!`);
    } catch {
      toast.error("Failed to mark submission. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="bg-card border border-border rounded-xl p-3.5 shadow-card role-student"
      data-ocid={`hw-card-${hw.id}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">{hw.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {hw.subject} · Class {studentClass}
          </p>
        </div>
        {isSubmitted ? (
          <Badge className="flex-shrink-0 bg-accent/10 text-accent border-accent/30 text-xs font-semibold px-2 py-0.5 border">
            <CheckCircle2 size={11} className="mr-1" /> Submitted
          </Badge>
        ) : overdue ? (
          <Badge
            variant="outline"
            className="flex-shrink-0 bg-destructive/10 text-destructive border-destructive/30 text-xs font-semibold px-2 py-0.5"
          >
            Overdue
          </Badge>
        ) : dueSoon ? (
          <Badge
            variant="outline"
            className="flex-shrink-0 bg-[oklch(0.75_0.15_55)]/10 text-[oklch(0.5_0.18_55)] border-[oklch(0.75_0.15_55)]/30 text-xs font-semibold px-2 py-0.5"
          >
            Due Soon
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="flex-shrink-0 bg-muted text-muted-foreground border-border text-xs font-semibold px-2 py-0.5"
          >
            Pending
          </Badge>
        )}
      </div>

      {hw.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5">
          {hw.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={11} />
          <span>
            Due:{" "}
            {new Date(hw.dueDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {!isSubmitted && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2.5 gap-1"
            onClick={handleSubmit}
            disabled={submitting}
            data-ocid={`btn-submit-${hw.id}`}
          >
            <CheckCircle2 size={12} />
            {submitting ? "Submitting…" : "Mark Submitted"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function StudentHomework() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const studentId = userProfile?.id ?? "";
  const { data: students } = useStudents();

  // Find the student record by matching grNo to userProfile.roleId
  const studentRecord = students?.find((s) => s.grNo === userProfile?.roleId);
  const studentClass =
    (studentRecord?.className as string | undefined) ??
    (studentRecord as unknown as { class_?: string })?.class_ ??
    "";
  const { data: homework, isLoading } = useHomeworkByClass(studentClass);

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "profile") navigate({ to: "/student/profile" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };

  if (isLoading) return <PageLoader />;

  const pending = (homework ?? []).filter((hw) => !isPastDue(hw.dueDate));
  const past = (homework ?? []).filter((hw) => isPastDue(hw.dueDate));

  return (
    <Layout activeTab="home" onTabChange={handleTabChange} title="Homework">
      <div className="px-4 pt-4 pb-4 space-y-4">
        {!homework || homework.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No homework assigned"
            description="Homework assignments from your teachers will appear here."
            data-ocid="empty-homework"
          />
        ) : (
          <>
            {pending.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5">
                  Upcoming ({pending.length})
                </h3>
                <div className="space-y-2" data-ocid="homework-pending">
                  {pending.map((hw) => (
                    <HomeworkCard
                      key={hw.id}
                      hw={hw}
                      studentId={studentId}
                      studentClass={studentClass}
                    />
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5">
                  Past Due ({past.length})
                </h3>
                <div className="space-y-2 opacity-75" data-ocid="homework-past">
                  {past.map((hw) => (
                    <HomeworkCard
                      key={hw.id}
                      hw={hw}
                      studentId={studentId}
                      studentClass={studentClass}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
