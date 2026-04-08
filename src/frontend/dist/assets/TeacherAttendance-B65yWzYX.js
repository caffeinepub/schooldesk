import { u as useNavigate, a as useAuth, r as reactExports, j as jsxRuntimeExports, P as PageLoader, b as ue } from "./index-BBwbkILB.js";
import { L as Layout, a as Badge } from "./Layout-8MqYqfzj.js";
import { c as createLucideIcon, B as Button } from "./graduation-cap-D7guj77i.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { f as useTeachers, b as useStudents, m as useMarkAttendance, l as useAttendanceByClass } from "./useBackend-slhkZeTo.js";
import { C as ClipboardCheck } from "./clipboard-check-DaPv9-Lu.js";
import { C as CircleCheck, a as Clock } from "./clock-OJQlIU5N.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
const STATUS_CONFIG = {
  present: {
    label: "P",
    icon: CircleCheck,
    classes: "bg-accent/10 text-accent border-accent/30"
  },
  absent: {
    label: "A",
    icon: CircleX,
    classes: "bg-destructive/10 text-destructive border-destructive/30"
  },
  late: {
    label: "L",
    icon: Clock,
    classes: "bg-primary/10 text-primary border-primary/30"
  },
  excused: {
    label: "E",
    icon: CircleCheck,
    classes: "bg-muted text-muted-foreground border-border"
  }
};
function TeacherAttendance() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: teachers } = useTeachers();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { mutateAsync: markAttendance, isPending: saving } = useMarkAttendance();
  const currentTeacher = teachers == null ? void 0 : teachers.find(
    (t) => t.teacherId === (userProfile == null ? void 0 : userProfile.roleId)
  );
  const assignedClasses = (currentTeacher == null ? void 0 : currentTeacher.assignedClasses) ?? [];
  const [selectedClass, setSelectedClass] = reactExports.useState(assignedClasses[0] ?? "");
  const [selectedDate, setSelectedDate] = reactExports.useState(
    (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const [entries, setEntries] = reactExports.useState([]);
  const [saved, setSaved] = reactExports.useState(false);
  const { data: existingAttendance, isLoading: attLoading } = useAttendanceByClass(selectedClass);
  const classStudents = (students ?? []).filter((s) => {
    const cls = `${s.className}-${s.section}`;
    return cls === selectedClass || s.className === selectedClass;
  });
  reactExports.useEffect(() => {
    const filtered = (students ?? []).filter((s) => {
      const cls = `${s.className}-${s.section}`;
      return cls === selectedClass || s.className === selectedClass;
    });
    if (!filtered.length) return;
    const dateRecords = (existingAttendance ?? []).filter(
      (a) => a.date === selectedDate
    );
    setEntries(
      filtered.map((s) => {
        const existing = dateRecords.find((a) => a.studentId === s.id);
        return {
          studentId: s.id,
          studentName: s.name,
          status: existing ? existing.status : "none"
        };
      })
    );
    setSaved(false);
  }, [students, selectedClass, selectedDate, existingAttendance]);
  const setStatus = (studentId, status) => {
    setEntries(
      (prev) => prev.map((e) => e.studentId === studentId ? { ...e, status } : e)
    );
    setSaved(false);
  };
  const markAll = (status) => {
    setEntries((prev) => prev.map((e) => ({ ...e, status })));
    setSaved(false);
  };
  const handleSave = async () => {
    const unmarked = entries.filter((e) => e.status === "none");
    if (unmarked.length > 0) {
      ue.error(`${unmarked.length} student(s) not marked`);
      return;
    }
    await Promise.all(
      entries.map(
        (e) => markAttendance({
          studentId: e.studentId,
          date: selectedDate,
          status: e.status
        })
      )
    );
    ue.success("Attendance saved");
    setSaved(true);
  };
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "profile") navigate({ to: "/teacher/profile" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };
  const presentCount = entries.filter((e) => e.status === "present").length;
  const absentCount = entries.filter((e) => e.status === "absent").length;
  const lateCount = entries.filter((e) => e.status === "late").length;
  const isLoading = studentsLoading || attLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "home", onTabChange: handleTabChange, title: "Attendance", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-4", children: [
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-3.5 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: "attendance-date",
          className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5",
          children: "Date"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "attendance-date",
          type: "date",
          value: selectedDate,
          onChange: (e) => setSelectedDate(e.target.value),
          className: "w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          "data-ocid": "input-attendance-date"
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) : !selectedClass ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: ClipboardCheck,
        title: "No class selected",
        description: "You have no assigned classes.",
        "data-ocid": "empty-no-class"
      }
    ) : classStudents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: ClipboardCheck,
        title: "No students found",
        description: "No students enrolled in this class.",
        "data-ocid": "empty-attendance"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      entries.some((e) => e.status !== "none") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-accent/5 border border-accent/20 rounded-xl p-2.5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-bold text-accent", children: presentCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Present" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/5 border border-destructive/20 rounded-xl p-2.5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-bold text-destructive", children: absentCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Absent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-2.5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-bold text-primary", children: lateCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Late" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Mark all:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => markAll("present"),
            className: "px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20",
            "data-ocid": "btn-all-present",
            children: "Present"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => markAll("absent"),
            className: "px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20",
            "data-ocid": "btn-all-absent",
            children: "Absent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: entries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3 shadow-card flex items-center justify-between",
          "data-ocid": `att-row-${entry.studentId}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-accent", children: entry.studentName.charAt(0) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate max-w-[130px]", children: entry.studentName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              ["present", "absent", "late"].map(
                (status) => {
                  const config = STATUS_CONFIG[status];
                  const isActive = entry.status === status;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setStatus(entry.studentId, status),
                      className: `w-8 h-8 rounded-full border text-xs font-bold transition-smooth ${isActive ? config.classes : "bg-muted text-muted-foreground border-border hover:border-accent/40"}`,
                      "aria-label": `Mark ${entry.studentName} as ${status}`,
                      "data-ocid": `btn-${status}-${entry.studentId}`,
                      children: config.label
                    },
                    status
                  );
                }
              ),
              entry.status !== "none" && entry.status !== "present" && entry.status !== "absent" && entry.status !== "late" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: entry.status })
            ] })
          ]
        },
        entry.studentId
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSave,
          disabled: saving || saved,
          className: "w-full",
          "data-ocid": "btn-save-attendance",
          children: saving ? "Saving…" : saved ? "Attendance Saved ✓" : "Save Attendance"
        }
      )
    ] })
  ] }) });
}
export {
  TeacherAttendance as default
};
