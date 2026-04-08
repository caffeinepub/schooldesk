import { u as useNavigate, a as useAuth, j as jsxRuntimeExports, P as PageLoader, r as reactExports, b as ue } from "./index-BBwbkILB.js";
import { L as Layout, a as Badge } from "./Layout-8MqYqfzj.js";
import { B as Button } from "./graduation-cap-D7guj77i.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { b as useStudents, p as useHomeworkByClass, r as useSubmissions, s as useMarkSubmission } from "./useBackend-slhkZeTo.js";
import { B as BookOpen } from "./book-open-CnWzzPJQ.js";
import { C as CircleCheck, a as Clock } from "./clock-OJQlIU5N.js";
function isDueSoon(dueDate) {
  const due = new Date(dueDate);
  const now = /* @__PURE__ */ new Date();
  const diff = (due.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24);
  return diff >= 0 && diff <= 2;
}
function isPastDue(dueDate) {
  return new Date(dueDate) < /* @__PURE__ */ new Date();
}
function HomeworkCard({
  hw,
  studentId,
  studentClass
}) {
  const [submitting, setSubmitting] = reactExports.useState(false);
  const { data: submissions } = useSubmissions(hw.id);
  const markSubmission = useMarkSubmission();
  const isSubmitted = (submissions ?? []).some(
    (s) => s.studentId === studentId
  );
  const dueSoon = isDueSoon(hw.dueDate);
  const overdue = isPastDue(hw.dueDate);
  async function handleSubmit() {
    setSubmitting(true);
    try {
      await markSubmission.mutateAsync({
        homeworkId: hw.id,
        studentId,
        remarks: ""
      });
      ue.success(`"${hw.title}" marked as submitted!`);
    } catch {
      ue.error("Failed to mark submission. Try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl p-3.5 shadow-card role-student",
      "data-ocid": `hw-card-${hw.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: hw.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              hw.subject,
              " · Class ",
              studentClass
            ] })
          ] }),
          isSubmitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "flex-shrink-0 bg-accent/10 text-accent border-accent/30 text-xs font-semibold px-2 py-0.5 border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11, className: "mr-1" }),
            " Submitted"
          ] }) : overdue ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "flex-shrink-0 bg-destructive/10 text-destructive border-destructive/30 text-xs font-semibold px-2 py-0.5",
              children: "Overdue"
            }
          ) : dueSoon ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "flex-shrink-0 bg-[oklch(0.75_0.15_55)]/10 text-[oklch(0.5_0.18_55)] border-[oklch(0.75_0.15_55)]/30 text-xs font-semibold px-2 py-0.5",
              children: "Due Soon"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "flex-shrink-0 bg-muted text-muted-foreground border-border text-xs font-semibold px-2 py-0.5",
              children: "Pending"
            }
          )
        ] }),
        hw.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mb-2.5", children: hw.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Due:",
              " ",
              new Date(hw.dueDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short"
              })
            ] })
          ] }),
          !isSubmitted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs px-2.5 gap-1",
              onClick: handleSubmit,
              disabled: submitting,
              "data-ocid": `btn-submit-${hw.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
                submitting ? "Submitting…" : "Mark Submitted"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function StudentHomework() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const studentId = (userProfile == null ? void 0 : userProfile.id) ?? "";
  const { data: students } = useStudents();
  const studentRecord = students == null ? void 0 : students.find((s) => s.grNo === (userProfile == null ? void 0 : userProfile.roleId));
  const studentClass = (studentRecord == null ? void 0 : studentRecord.className) ?? (studentRecord == null ? void 0 : studentRecord.class_) ?? "";
  const { data: homework, isLoading } = useHomeworkByClass(studentClass);
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "profile") navigate({ to: "/student/profile" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const pending = (homework ?? []).filter((hw) => !isPastDue(hw.dueDate));
  const past = (homework ?? []).filter((hw) => isPastDue(hw.dueDate));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "home", onTabChange: handleTabChange, title: "Homework", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-4 pb-4 space-y-4", children: !homework || homework.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    EmptyState,
    {
      icon: BookOpen,
      title: "No homework assigned",
      description: "Homework assignments from your teachers will appear here.",
      "data-ocid": "empty-homework"
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5", children: [
        "Upcoming (",
        pending.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "homework-pending", children: pending.map((hw) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        HomeworkCard,
        {
          hw,
          studentId,
          studentClass
        },
        hw.id
      )) })
    ] }),
    past.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5", children: [
        "Past Due (",
        past.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 opacity-75", "data-ocid": "homework-past", children: past.map((hw) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        HomeworkCard,
        {
          hw,
          studentId,
          studentClass
        },
        hw.id
      )) })
    ] })
  ] }) }) });
}
export {
  StudentHomework as default
};
