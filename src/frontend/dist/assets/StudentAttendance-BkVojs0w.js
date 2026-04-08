import { u as useNavigate, a as useAuth, j as jsxRuntimeExports, P as PageLoader, c as cn } from "./index-BBwbkILB.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { L as Layout } from "./Layout-8MqYqfzj.js";
import { z as useAttendanceByStudent, x as useAttendanceSummary } from "./useBackend-slhkZeTo.js";
import { C as ClipboardCheck } from "./clipboard-check-DaPv9-Lu.js";
import "./graduation-cap-D7guj77i.js";
const STATUS_STYLES = {
  present: {
    dot: "bg-accent",
    bg: "bg-accent/10",
    text: "text-accent",
    label: "Present"
  },
  absent: {
    dot: "bg-destructive",
    bg: "bg-destructive/10",
    text: "text-destructive",
    label: "Absent"
  },
  late: {
    dot: "bg-[oklch(0.65_0.18_55)]",
    bg: "bg-[oklch(0.65_0.18_55)]/10",
    text: "text-[oklch(0.5_0.18_55)]",
    label: "Late"
  },
  excused: {
    dot: "bg-muted-foreground",
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "Excused"
  }
};
function StudentAttendance() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const studentId = (userProfile == null ? void 0 : userProfile.id) ?? "";
  const { data: records, isLoading } = useAttendanceByStudent(studentId);
  const { data: summary } = useAttendanceSummary(studentId);
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "profile") navigate({ to: "/student/profile" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const sortedRecords = records ? [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      activeTab: "home",
      onTabChange: handleTabChange,
      title: "My Attendance",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-4", children: [
        summary && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-4 shadow-card role-student",
            "data-ocid": "attendance-summary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Overall Attendance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: cn(
                      "text-2xl font-display font-bold",
                      summary.percentage >= 75 ? "text-accent" : "text-destructive"
                    ),
                    children: [
                      summary.percentage,
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "h-full rounded-full transition-smooth",
                    summary.percentage >= 75 ? "bg-accent" : "bg-destructive"
                  ),
                  style: { width: `${Math.min(100, summary.percentage)}%` }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 text-center", children: [
                {
                  label: "Total",
                  value: summary.totalDays,
                  color: "text-foreground"
                },
                {
                  label: "Present",
                  value: summary.present,
                  color: "text-accent"
                },
                {
                  label: "Absent",
                  value: summary.absent,
                  color: "text-destructive"
                },
                {
                  label: "Late",
                  value: summary.late,
                  color: "text-[oklch(0.5_0.18_55)]"
                }
              ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-lg py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("font-bold text-lg leading-tight", color), children: value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
              ] }, label)) }),
              summary.percentage < 75 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-3 text-center font-medium", children: "⚠ Attendance below 75% — please attend regularly" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 px-0.5", children: Object.entries(STATUS_STYLES).map(([status, cfg]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("w-2 h-2 rounded-full", cfg.dot) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: cfg.label })
        ] }, status)) }),
        sortedRecords.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: ClipboardCheck,
            title: "No attendance records",
            description: "Your attendance history will appear here once your teacher marks it.",
            "data-ocid": "empty-attendance"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", "data-ocid": "attendance-list", children: sortedRecords.map((record) => {
          const cfg = STATUS_STYLES[record.status] ?? STATUS_STYLES.excused;
          const dateObj = new Date(record.date);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "border border-border rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-card",
                cfg.bg
              ),
              "data-ocid": `attendance-row-${record.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        cfg.dot
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: dateObj.toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short"
                    }) }),
                    record.remarks && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: record.remarks })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      cfg.bg,
                      cfg.text
                    ),
                    children: cfg.label
                  }
                )
              ]
            },
            record.id
          );
        }) })
      ] })
    }
  );
}
export {
  StudentAttendance as default
};
