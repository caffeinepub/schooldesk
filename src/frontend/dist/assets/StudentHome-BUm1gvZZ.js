import { u as useNavigate, a as useAuth, j as jsxRuntimeExports, P as PageLoader } from "./index-BBwbkILB.js";
import { D as DashboardCard } from "./DashboardCard-N--pxpbJ.js";
import { L as Layout, B as Bell } from "./Layout-8MqYqfzj.js";
import { w as useMyProfile, a as useNotices, x as useAttendanceSummary, y as useFeesByStudent, t as useMarksByStudent, p as useHomeworkByClass } from "./useBackend-slhkZeTo.js";
import { C as ClipboardCheck } from "./clipboard-check-DaPv9-Lu.js";
import { D as DollarSign } from "./dollar-sign-CVQveGAv.js";
import { B as BookOpen } from "./book-open-CnWzzPJQ.js";
import { c as createLucideIcon } from "./graduation-cap-D7guj77i.js";
import { S as Star } from "./star-7RyhZ455.js";
import { C as ChevronRight } from "./chevron-right-hTEMbx7u.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
const QUICK_LINKS = [
  { label: "Marks", icon: Star, path: "/student/marks", ocid: "action-marks" },
  {
    label: "Homework",
    icon: BookOpen,
    path: "/student/homework",
    ocid: "action-homework"
  },
  {
    label: "Attendance",
    icon: ClipboardCheck,
    path: "/student/attendance",
    ocid: "action-attendance"
  },
  {
    label: "Notices",
    icon: Bell,
    path: "/student/notifications",
    ocid: "action-notices"
  }
];
function StudentHome() {
  var _a;
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const studentId = (userProfile == null ? void 0 : userProfile.id) ?? "";
  const { data: profile } = useMyProfile();
  const { data: notices, isLoading } = useNotices();
  const { data: attendanceSummary } = useAttendanceSummary(studentId);
  const { data: fees } = useFeesByStudent(studentId);
  const { data: marks } = useMarksByStudent(studentId);
  const studentClass = (profile == null ? void 0 : profile.className) ?? "";
  const { data: homework } = useHomeworkByClass(studentClass);
  const handleTabChange = (tab) => {
    if (tab === "profile") navigate({ to: "/student/profile" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };
  const unpaidFees = (fees ?? []).filter((f) => f.status !== "paid");
  const outstandingBalance = unpaidFees.reduce(
    (sum, f) => sum + (f.amount - f.paidAmount),
    0
  );
  const attendanceRate = (attendanceSummary == null ? void 0 : attendanceSummary.percentage) ?? 0;
  const pendingHomework = (homework ?? []).filter((hw) => {
    const due = new Date(hw.dueDate);
    return due >= /* @__PURE__ */ new Date();
  }).length;
  const avgScore = marks && marks.length > 0 ? Math.round(
    marks.reduce((sum, m) => {
      const score = m.score ?? m.marks ?? 0;
      const max = m.maxScore ?? m.maxMarks ?? 0;
      return sum + (max > 0 ? score / max * 100 : 0);
    }, 0) / marks.length * 10
  ) / 10 : null;
  const recentNotices = (notices ?? []).filter((n) => n.audience === "student" || n.audience === "all").slice(0, 3);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "home", onTabChange: handleTabChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-4 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl text-foreground", children: [
        "Hi, ",
        ((_a = userProfile == null ? void 0 : userProfile.name) == null ? void 0 : _a.split(" ")[0]) ?? "Student",
        " 👋"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: ClipboardCheck,
          iconColor: "bg-accent/10 text-accent",
          label: "Attendance",
          value: `${attendanceRate}%`,
          subValue: `${(attendanceSummary == null ? void 0 : attendanceSummary.present) ?? 0} of ${(attendanceSummary == null ? void 0 : attendanceSummary.totalDays) ?? 0} days`,
          accent: "student",
          onClick: () => navigate({ to: "/student/attendance" }),
          "data-ocid": "card-attendance"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: DollarSign,
          iconColor: outstandingBalance > 0 ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent",
          label: "Fees Balance",
          value: outstandingBalance > 0 ? `₹${outstandingBalance.toLocaleString("en-IN")}` : "All Clear",
          subValue: outstandingBalance > 0 ? `${unpaidFees.length} pending` : "No dues",
          accent: "student",
          onClick: () => navigate({ to: "/student/fees" }),
          "data-ocid": "card-fees"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: BookOpen,
          iconColor: pendingHomework > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
          label: "Pending HW",
          value: pendingHomework,
          subValue: pendingHomework > 0 ? "Due soon" : "All submitted",
          accent: "student",
          onClick: () => navigate({ to: "/student/homework" }),
          "data-ocid": "card-homework"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: TrendingUp,
          iconColor: "bg-primary/10 text-primary",
          label: "Avg Score",
          value: avgScore !== null ? `${avgScore}%` : "--",
          subValue: (marks == null ? void 0 : marks.length) ? `${marks.length} assessments` : "No data",
          accent: "student",
          onClick: () => navigate({ to: "/student/marks" }),
          "data-ocid": "card-marks"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5", children: "Quick Access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: QUICK_LINKS.map(({ label, icon: Icon, path, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: path }),
          className: "bg-card border border-border rounded-xl p-3.5 flex items-center gap-3 shadow-card hover:shadow-elevated transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "data-ocid": ocid,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-foreground", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChevronRight,
              {
                size: 14,
                className: "text-muted-foreground ml-auto"
              }
            )
          ]
        },
        path
      )) })
    ] }),
    recentNotices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider", children: "Latest Notices" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/student/notifications" }),
            className: "text-xs text-primary font-medium flex items-center gap-0.5 hover:underline",
            children: [
              "View all ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12 })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "notices-preview", children: recentNotices.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `bg-card border border-border rounded-xl p-3.5 shadow-card ${n.isImportant ? "border-l-4 border-l-destructive" : "role-student"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: n.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: n.content })
            ] }),
            n.isImportant && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 text-[9px] font-bold text-destructive uppercase tracking-wider bg-destructive/10 px-1.5 py-0.5 rounded", children: "Important" })
          ] })
        },
        n.id
      )) })
    ] })
  ] }) });
}
export {
  StudentHome as default
};
