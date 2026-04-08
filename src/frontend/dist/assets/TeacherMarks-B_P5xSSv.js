import { u as useNavigate, a as useAuth, r as reactExports, j as jsxRuntimeExports, P as PageLoader, b as ue } from "./index-BBwbkILB.js";
import { L as Layout, a as Badge } from "./Layout-8MqYqfzj.js";
import { B as Button } from "./graduation-cap-D7guj77i.js";
import { L as Label, I as Input } from "./label-C0UuxCOR.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { f as useTeachers, b as useStudents, t as useMarksByStudent, v as useAddMark } from "./useBackend-slhkZeTo.js";
import { S as Star } from "./star-7RyhZ455.js";
import { X } from "./x-GY-xxyRz.js";
import { P as Plus } from "./plus-EoiM-lKm.js";
import { C as ChevronRight } from "./chevron-right-hTEMbx7u.js";
import "./index-B3XdCMvE.js";
const EXAM_TYPES = ["Unit Test", "Mid-Term", "Final", "Assignment", "Quiz"];
function StudentRow({
  student,
  onSelect
}) {
  const { data: marks } = useMarksByStudent(student.id);
  const avg = marks && marks.length > 0 ? Math.round(
    marks.reduce((sum, m) => {
      const score = m.score ?? m.marks ?? 0;
      const max = m.maxScore ?? m.maxMarks ?? 0;
      return sum + (max > 0 ? score / max * 100 : 0);
    }, 0) / marks.length
  ) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: onSelect,
      className: "w-full bg-card border border-border rounded-xl p-3.5 shadow-card flex items-center justify-between hover:shadow-elevated transition-smooth",
      "data-ocid": `student-row-${student.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-accent", children: student.name.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: student.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "GR: ",
              student.grNo
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          avg !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: `text-xs ${avg >= 75 ? "text-accent border-accent/30" : avg >= 50 ? "text-foreground border-border" : "text-destructive border-destructive/30"}`,
              children: [
                avg,
                "%"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-muted-foreground" })
        ] })
      ]
    }
  );
}
function StudentMarksView({
  student,
  subject,
  onBack,
  className
}) {
  const { data: marks, isLoading } = useMarksByStudent(student.id);
  const { mutateAsync: addMark, isPending } = useAddMark();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    subject,
    examType: "Unit Test",
    marks: "",
    maxMarks: "100",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    remarks: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const marksNum = Number.parseFloat(form.marks);
    const maxMarksNum = Number.parseFloat(form.maxMarks);
    if (Number.isNaN(marksNum) || Number.isNaN(maxMarksNum) || marksNum > maxMarksNum) {
      ue.error("Invalid marks values");
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
      remarks: form.remarks
    });
    ue.success("Marks saved");
    setShowForm(false);
    setForm({
      subject,
      examType: "Unit Test",
      marks: "",
      maxMarks: "100",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      remarks: ""
    });
  };
  const gradeColor = (m, max) => {
    const pct = m / max * 100;
    if (pct >= 75) return "text-accent";
    if (pct >= 50) return "text-foreground";
    return "text-destructive";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "text-xs text-accent font-semibold",
          "data-ocid": "btn-back-to-students",
          children: "← All Students"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate", children: student.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: () => setShowForm((v) => !v),
        className: "w-full",
        "data-ocid": "btn-add-mark",
        children: showForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, className: "mr-2" }),
          " Cancel"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-2" }),
          " Add Marks"
        ] })
      }
    ),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "bg-card border border-border rounded-xl p-4 shadow-card space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Enter Marks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "m-subject", className: "text-xs", children: "Subject" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "m-subject",
                  value: form.subject,
                  onChange: (e) => setForm((f) => ({ ...f, subject: e.target.value })),
                  "data-ocid": "input-mark-subject"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "m-exam", className: "text-xs", children: "Exam Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "m-exam",
                  value: form.examType,
                  onChange: (e) => setForm((f) => ({ ...f, examType: e.target.value })),
                  className: "w-full h-9 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                  "data-ocid": "select-exam-type",
                  children: EXAM_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "m-score", className: "text-xs", children: "Score *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "m-score",
                  type: "number",
                  min: "0",
                  placeholder: "0",
                  value: form.marks,
                  onChange: (e) => setForm((f) => ({ ...f, marks: e.target.value })),
                  "data-ocid": "input-mark-score"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "m-max", className: "text-xs", children: "Max Score *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "m-max",
                  type: "number",
                  min: "1",
                  placeholder: "100",
                  value: form.maxMarks,
                  onChange: (e) => setForm((f) => ({ ...f, maxMarks: e.target.value })),
                  "data-ocid": "input-mark-max"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "m-date", className: "text-xs", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "m-date",
                  type: "date",
                  value: form.date,
                  onChange: (e) => setForm((f) => ({ ...f, date: e.target.value })),
                  "data-ocid": "input-mark-date"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "m-remarks", className: "text-xs", children: "Remarks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "m-remarks",
                  placeholder: "Optional",
                  value: form.remarks,
                  onChange: (e) => setForm((f) => ({ ...f, remarks: e.target.value })),
                  "data-ocid": "input-mark-remarks"
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
              "data-ocid": "btn-submit-mark",
              children: isPending ? "Saving…" : "Save Marks"
            }
          )
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) : !marks || marks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Star,
        title: "No marks yet",
        description: "Add marks using the button above.",
        "data-ocid": "empty-student-marks"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: marks.map((m) => {
      const score = m.score ?? m.marks ?? 0;
      const maxScore = m.maxScore ?? m.maxMarks ?? 0;
      const label = m.assessmentName ?? m.examType ?? "";
      const dateStr = (() => {
        const raw = m.date;
        if (typeof raw === "bigint")
          return new Date(Number(raw) / 1e6).toLocaleDateString(
            "en-IN"
          );
        return new Date(m.date).toLocaleDateString("en-IN");
      })();
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3.5 shadow-card role-teacher",
          "data-ocid": `mark-row-${m.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: m.subject }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  label,
                  " · ",
                  dateStr
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: `text-lg font-display font-bold ${gradeColor(score, maxScore)}`,
                    children: [
                      score,
                      "/",
                      maxScore
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  maxScore > 0 ? Math.round(score / maxScore * 100) : 0,
                  "%"
                ] })
              ] })
            ] }),
            m.remarks && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 italic", children: m.remarks })
          ]
        },
        m.id
      );
    }) })
  ] });
}
function TeacherMarks() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: teachers } = useTeachers();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const [selectedClass, setSelectedClass] = reactExports.useState("");
  const [selectedStudent, setSelectedStudent] = reactExports.useState(null);
  const currentTeacher = teachers == null ? void 0 : teachers.find(
    (t) => t.teacherId === (userProfile == null ? void 0 : userProfile.roleId)
  );
  const assignedClasses = (currentTeacher == null ? void 0 : currentTeacher.assignedClasses) ?? [];
  const activeClass = selectedClass || assignedClasses[0] || "";
  const classStudents = (students ?? []).filter((s) => {
    const cls = `${s.className}-${s.section}`;
    return cls === activeClass || s.className === activeClass;
  });
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "profile") navigate({ to: "/teacher/profile" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "home", onTabChange: handleTabChange, title: "Marks", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-4", children: [
    assignedClasses.length > 0 && !selectedStudent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1", children: assignedClasses.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setSelectedClass(cls),
        className: `shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth ${activeClass === cls ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border hover:border-accent/50"}`,
        "data-ocid": `class-tab-${cls}`,
        children: cls
      },
      cls
    )) }),
    selectedStudent ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      StudentMarksView,
      {
        student: selectedStudent,
        subject: (currentTeacher == null ? void 0 : currentTeacher.subject) ?? "",
        onBack: () => setSelectedStudent(null),
        className: activeClass
      }
    ) : studentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) : classStudents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Star,
        title: "No students found",
        description: activeClass ? "No students in this class." : "Select a class to view students.",
        "data-ocid": "empty-marks"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: classStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      StudentRow,
      {
        student: s,
        onSelect: () => setSelectedStudent(s)
      },
      s.id
    )) })
  ] }) });
}
export {
  TeacherMarks as default
};
