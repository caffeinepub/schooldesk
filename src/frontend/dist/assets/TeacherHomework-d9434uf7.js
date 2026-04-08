import { u as useNavigate, a as useAuth, r as reactExports, j as jsxRuntimeExports, P as PageLoader, b as ue } from "./index-BBwbkILB.js";
import { L as Layout, a as Badge } from "./Layout-8MqYqfzj.js";
import { c as createLucideIcon, B as Button } from "./graduation-cap-D7guj77i.js";
import { L as Label, I as Input } from "./label-C0UuxCOR.js";
import { T as Textarea } from "./textarea-Cd4JL9G1.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { f as useTeachers, b as useStudents, q as useCreateHomework, p as useHomeworkByClass, r as useSubmissions, s as useMarkSubmission } from "./useBackend-slhkZeTo.js";
import { X } from "./x-GY-xxyRz.js";
import { P as Plus } from "./plus-EoiM-lKm.js";
import { B as BookOpen } from "./book-open-CnWzzPJQ.js";
import { C as ChevronDown } from "./chevron-down-mvrh78sb.js";
import { C as Calendar } from "./calendar-B_HBu5f3.js";
import "./index-B3XdCMvE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode);
function SubmissionRow({
  homeworkId,
  studentId,
  studentName
}) {
  const { data: submissions } = useSubmissions(homeworkId);
  const { mutateAsync: markSubmission, isPending } = useMarkSubmission();
  const isSubmitted = submissions == null ? void 0 : submissions.some((s) => s.studentId === studentId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-border last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground truncate flex-1 min-w-0 mr-2", children: studentName }),
    isSubmitted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        variant: "outline",
        className: "text-accent border-accent/30 bg-accent/5 shrink-0",
        children: "Submitted"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        size: "sm",
        variant: "outline",
        className: "h-7 text-xs shrink-0",
        disabled: isPending,
        onClick: async () => {
          await markSubmission({ homeworkId, studentId });
          ue.success(`${studentName} marked as submitted`);
        },
        "data-ocid": `btn-mark-submission-${studentId}`,
        children: "Mark Done"
      }
    )
  ] });
}
function HomeworkCard({
  hw,
  classStudents
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const isPastDue = new Date(hw.dueDate) < /* @__PURE__ */ new Date();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl shadow-card role-teacher overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setExpanded((e) => !e),
        className: "w-full p-4 text-left",
        "data-ocid": `hw-expand-${hw.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: hw.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: hw.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: isPastDue ? "text-destructive border-destructive/30 bg-destructive/5 text-xs" : "text-accent border-accent/30 bg-accent/5 text-xs",
                  children: isPastDue ? "Overdue" : "Active"
                }
              ),
              expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Due: ",
              new Date(hw.dueDate).toLocaleDateString("en-IN")
            ] })
          ] })
        ]
      }
    ),
    expanded && classStudents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3 mb-2", children: "Submissions" }),
      classStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        SubmissionRow,
        {
          homeworkId: hw.id,
          studentId: s.id,
          studentName: s.name
        },
        s.id
      ))
    ] })
  ] });
}
function TeacherHomework() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: teachers } = useTeachers();
  const { data: students } = useStudents();
  const { mutateAsync: createHomework, isPending } = useCreateHomework();
  const currentTeacher = teachers == null ? void 0 : teachers.find(
    (t) => t.teacherId === (userProfile == null ? void 0 : userProfile.roleId)
  );
  const assignedClasses = (currentTeacher == null ? void 0 : currentTeacher.assignedClasses) ?? [];
  const [selectedClass, setSelectedClass] = reactExports.useState(assignedClasses[0] ?? "");
  const [showForm, setShowForm] = reactExports.useState(false);
  const { data: homework, isLoading } = useHomeworkByClass(selectedClass);
  const [form, setForm] = reactExports.useState({
    title: "",
    description: "",
    dueDate: "",
    subject: (currentTeacher == null ? void 0 : currentTeacher.subject) ?? ""
  });
  const classStudents = (students ?? []).filter((s) => {
    const cls = `${s.className}-${s.section}`;
    return cls === selectedClass || s.className === selectedClass;
  }).map((s) => ({ id: s.id, name: s.name }));
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "profile") navigate({ to: "/teacher/profile" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.dueDate || !selectedClass) {
      ue.error("Please fill all required fields");
      return;
    }
    await createHomework({
      title: form.title,
      description: form.description,
      className: selectedClass,
      subject: form.subject,
      dueDate: form.dueDate,
      assignedBy: (userProfile == null ? void 0 : userProfile.name) ?? "Teacher"
    });
    ue.success("Homework assigned successfully");
    setForm({
      title: "",
      description: "",
      dueDate: "",
      subject: (currentTeacher == null ? void 0 : currentTeacher.subject) ?? ""
    });
    setShowForm(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "home", onTabChange: handleTabChange, title: "Homework", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-4", children: [
    assignedClasses.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1", children: assignedClasses.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setSelectedClass(cls),
        className: `shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth ${selectedClass === cls ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border hover:border-accent/50"}`,
        "data-ocid": `class-tab-${cls}`,
        children: cls
      },
      cls
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: () => setShowForm((v) => !v),
        className: "w-full",
        "data-ocid": "btn-add-homework",
        children: showForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, className: "mr-2" }),
          " Cancel"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-2" }),
          " Assign Homework"
        ] })
      }
    ),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "bg-card border border-border rounded-xl p-4 shadow-card space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "New Homework" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hw-title", className: "text-xs", children: "Title *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "hw-title",
                placeholder: "e.g. Chapter 5 Exercise",
                value: form.title,
                onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })),
                "data-ocid": "input-hw-title"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hw-desc", className: "text-xs", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "hw-desc",
                placeholder: "Assignment details...",
                rows: 3,
                value: form.description,
                onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                "data-ocid": "input-hw-desc"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hw-subject", className: "text-xs", children: "Subject" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "hw-subject",
                  placeholder: "Subject",
                  value: form.subject,
                  onChange: (e) => setForm((f) => ({ ...f, subject: e.target.value })),
                  "data-ocid": "input-hw-subject"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hw-due", className: "text-xs", children: "Due Date *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "hw-due",
                  type: "date",
                  value: form.dueDate,
                  onChange: (e) => setForm((f) => ({ ...f, dueDate: e.target.value })),
                  "data-ocid": "input-hw-due"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full",
              disabled: isPending,
              "data-ocid": "btn-submit-homework",
              children: isPending ? "Saving…" : "Assign"
            }
          )
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) : !selectedClass ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: BookOpen,
        title: "No class selected",
        description: "Select a class to view or assign homework.",
        "data-ocid": "empty-no-class"
      }
    ) : homework && homework.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: BookOpen,
        title: "No homework yet",
        description: "Assign homework for this class using the button above.",
        "data-ocid": "empty-homework"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: (homework ?? []).map((hw) => /* @__PURE__ */ jsxRuntimeExports.jsx(HomeworkCard, { hw, classStudents }, hw.id)) })
  ] }) });
}
export {
  TeacherHomework as default
};
