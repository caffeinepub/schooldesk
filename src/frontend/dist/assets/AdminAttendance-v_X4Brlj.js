import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, c as cn, b as ue } from "./index-BBwbkILB.js";
import { c as createLucideIcon, B as Button } from "./graduation-cap-D7guj77i.js";
import { L as Label, I as Input } from "./label-C0UuxCOR.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { L as Layout } from "./Layout-8MqYqfzj.js";
import { S as StatusBadge } from "./StatusBadge-YQKFDOVw.js";
import { b as useStudents, l as useAttendanceByClass, m as useMarkAttendance } from "./useBackend-slhkZeTo.js";
import { C as ChevronDown } from "./chevron-down-mvrh78sb.js";
import { C as CalendarCheck } from "./calendar-check-D5NNW0ab.js";
import "./index-B3XdCMvE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
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
  "Grade 10"
];
const STATUS_BTNS = [
  { id: "present", label: "P", active: "bg-accent text-accent-foreground" },
  {
    id: "absent",
    label: "A",
    active: "bg-destructive text-destructive-foreground"
  },
  { id: "late", label: "L", active: "bg-[oklch(0.65_0.18_55)] text-white" }
];
function AdminAttendance() {
  const navigate = useNavigate();
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const [selectedClass, setSelectedClass] = reactExports.useState(CLASS_OPTIONS[5]);
  const [date, setDate] = reactExports.useState(today);
  const [attendanceMap, setAttendanceMap] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  const { data: allStudents = [] } = useStudents();
  const { data: existingRecords = [], isLoading } = useAttendanceByClass(selectedClass);
  const markAttendance = useMarkAttendance();
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };
  const classStudents = reactExports.useMemo(
    () => allStudents.filter((s) => s.className === selectedClass && s.isActive),
    [allStudents, selectedClass]
  );
  reactExports.useMemo(() => {
    const map = {};
    for (const r of existingRecords) {
      if (r.date === date) {
        map[r.studentId] = r.status;
      }
    }
    setAttendanceMap(map);
  }, [existingRecords, date]);
  const summary = reactExports.useMemo(() => {
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
        classStudents.map(
          (s) => markAttendance.mutateAsync({
            studentId: s.id,
            date,
            status: attendanceMap[s.id] ?? "absent"
          })
        )
      );
      ue.success(`Attendance saved for ${selectedClass}`);
    } catch {
      ue.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "home", onTabChange: handleTabChange, title: "Attendance", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Mark daily attendance by class" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1 block", children: "Class" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: selectedClass,
              onChange: (e) => setSelectedClass(e.target.value),
              className: "w-full appearance-none bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8",
              "data-ocid": "select-class",
              children: CLASS_OPTIONS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              size: 13,
              className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "att-date",
            className: "text-xs font-medium mb-1 block",
            children: "Date"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "att-date",
            type: "date",
            value: date,
            max: today,
            onChange: (e) => setDate(e.target.value),
            "data-ocid": "input-att-date"
          }
        )
      ] })
    ] }),
    classStudents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-3 flex items-center gap-3 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { size: 15, className: "text-primary flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-4 text-xs font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent", children: [
          "P: ",
          summary.present
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive", children: [
          "A: ",
          summary.absent
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[oklch(0.55_0.18_55)]", children: [
          "L: ",
          summary.late
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-auto font-normal", children: [
          "of ",
          classStudents.length
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { label: "Loading attendance…" }) }) : classStudents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: CalendarCheck,
        title: "No students in this class",
        description: "Students enrolled in the selected class will appear here.",
        "data-ocid": "empty-attendance"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "attendance-list", children: classStudents.map((s, idx) => {
        const status = attendanceMap[s.id] ?? null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card rounded-xl border border-border shadow-card px-4 py-3 flex items-center gap-3",
            "data-ocid": `attendance-row-${s.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-xs text-muted-foreground font-mono flex-shrink-0", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: s.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.grNo })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: STATUS_BTNS.map(({ id, label, active }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setAttendanceMap((m) => ({ ...m, [s.id]: id })),
                  "aria-label": id,
                  "data-ocid": `att-${id}-${s.id}`,
                  className: cn(
                    "w-8 h-8 rounded-full text-xs font-bold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    status === id ? cn(active, "scale-110 shadow-sm") : "bg-muted text-muted-foreground hover:bg-secondary"
                  ),
                  children: label
                },
                id
              )) }),
              status && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status })
            ]
          },
          s.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "w-full",
          onClick: handleSave,
          disabled: saving,
          "data-ocid": "btn-save-attendance",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 15, className: "mr-2" }),
            saving ? "Saving…" : `Save Attendance · ${selectedClass}`
          ]
        }
      )
    ] })
  ] }) });
}
export {
  AdminAttendance as default
};
