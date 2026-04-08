import { u as useNavigate, a as useAuth, j as jsxRuntimeExports, P as PageLoader } from "./index-BBwbkILB.js";
import { D as DashboardCard } from "./DashboardCard-N--pxpbJ.js";
import { L as Layout } from "./Layout-8MqYqfzj.js";
import { f as useTeachers, a as useNotices, b as useStudents, l as useAttendanceByClass, p as useHomeworkByClass } from "./useBackend-slhkZeTo.js";
import { U as Users } from "./users-CS1xEMfi.js";
import { B as BookOpen } from "./book-open-CnWzzPJQ.js";
import { C as ClipboardCheck } from "./clipboard-check-DaPv9-Lu.js";
import { S as Star } from "./star-7RyhZ455.js";
import { C as ChevronRight } from "./chevron-right-hTEMbx7u.js";
import "./graduation-cap-D7guj77i.js";
const ACTIONS = [
  { label: "Attendance", icon: ClipboardCheck, path: "/teacher/attendance" },
  { label: "Homework", icon: BookOpen, path: "/teacher/homework" },
  { label: "Marks", icon: Star, path: "/teacher/marks" }
];
function TeacherHome() {
  var _a;
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const { data: notices, isLoading: noticesLoading } = useNotices();
  const { data: students } = useStudents();
  const currentTeacher = teachers == null ? void 0 : teachers.find(
    (t) => t.teacherId === (userProfile == null ? void 0 : userProfile.roleId)
  );
  const assignedClasses = (currentTeacher == null ? void 0 : currentTeacher.assignedClasses) ?? [];
  const primaryClass = assignedClasses[0] ?? "";
  const { data: attendance } = useAttendanceByClass(primaryClass);
  const { data: homework } = useHomeworkByClass(primaryClass);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const todayAttendance = (attendance == null ? void 0 : attendance.filter((a) => a.date === today)) ?? [];
  const absentToday = todayAttendance.filter(
    (a) => a.status === "absent"
  ).length;
  const pendingHomework = (homework == null ? void 0 : homework.filter((h) => new Date(h.dueDate) >= /* @__PURE__ */ new Date()).length) ?? 0;
  const handleTabChange = (tab) => {
    if (tab === "profile") navigate({ to: "/teacher/profile" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };
  if (teachersLoading || noticesLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const relevantNotices = (notices ?? []).filter(
    (n) => n.audience === "teacher" || n.audience === "all"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "home", onTabChange: handleTabChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-4 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl text-foreground", children: [
        "Welcome, ",
        ((_a = userProfile == null ? void 0 : userProfile.name) == null ? void 0 : _a.split(" ")[0]) ?? "Teacher"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: Users,
          label: "Classes",
          value: assignedClasses.length,
          subValue: "assigned",
          accent: "teacher",
          iconColor: "bg-accent/10 text-accent",
          "data-ocid": "stat-classes"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: BookOpen,
          label: "Pending HW",
          value: pendingHomework,
          subValue: "assignments",
          accent: "teacher",
          iconColor: "bg-accent/10 text-accent",
          "data-ocid": "stat-homework"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: ClipboardCheck,
          label: "Absent Today",
          value: absentToday,
          subValue: primaryClass || "no class",
          accent: "teacher",
          iconColor: "bg-destructive/10 text-destructive",
          "data-ocid": "stat-absent"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ACTIONS.map(({ label, icon: Icon, path }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: path }),
        className: "bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-2 shadow-card hover:shadow-elevated transition-smooth",
        "data-ocid": `action-${label.toLowerCase()}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18, className: "text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: label })
        ]
      },
      path
    )) }),
    assignedClasses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2.5", children: "My Classes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: assignedClasses.map((cls) => {
        const classStudents = (students == null ? void 0 : students.filter(
          (s) => `${s.className}-${s.section}` === cls || s.className === cls
        )) ?? [];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-3.5 shadow-card role-teacher flex items-center justify-between",
            "data-ocid": `class-row-${cls}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: cls }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  classStudents.length,
                  " student",
                  classStudents.length !== 1 ? "s" : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => navigate({ to: "/teacher/attendance" }),
                  className: "text-accent",
                  "aria-label": "Take attendance",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 18 })
                }
              )
            ]
          },
          cls
        );
      }) })
    ] }),
    relevantNotices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider", children: "Notices" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/teacher/notifications" }),
            className: "text-xs text-accent font-medium flex items-center gap-0.5",
            children: [
              "View all ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12 })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: relevantNotices.slice(0, 3).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `bg-card border border-border rounded-xl p-3.5 shadow-card ${n.isImportant ? "border-l-4 border-l-destructive" : "role-teacher"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: n.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: n.content })
          ]
        },
        n.id
      )) })
    ] })
  ] }) });
}
export {
  TeacherHome as default
};
