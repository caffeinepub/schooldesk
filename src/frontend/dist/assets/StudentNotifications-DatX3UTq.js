import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, P as PageLoader, c as cn } from "./index-BBwbkILB.js";
import { L as Layout, B as Bell, a as Badge } from "./Layout-8MqYqfzj.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { a as useNotices } from "./useBackend-slhkZeTo.js";
import { M as Megaphone } from "./megaphone-CLLx7x11.js";
import "./graduation-cap-D7guj77i.js";
function StudentNotifications() {
  const navigate = useNavigate();
  const { data: notices, isLoading } = useNotices();
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "profile") navigate({ to: "/student/profile" });
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const studentNotices = (notices ?? []).filter(
    (n) => n.audience === "student" || n.audience === "all"
  );
  const filtered = activeFilter === "important" ? studentNotices.filter((n) => n.isImportant) : activeFilter === "class" ? studentNotices.filter((n) => n.audience === "student") : studentNotices;
  const importantCount = studentNotices.filter((n) => n.isImportant).length;
  const FILTER_TABS = [
    { id: "all", label: "All" },
    { id: "important", label: "Important" },
    { id: "class", label: "Student" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      activeTab: "notifications",
      onTabChange: handleTabChange,
      title: "Notices",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex gap-1.5 bg-muted/50 rounded-xl p-1",
            "data-ocid": "notice-filter-tabs",
            children: FILTER_TABS.map(({ id, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveFilter(id),
                className: cn(
                  "flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeFilter === id ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
                ),
                "data-ocid": `filter-${id}`,
                children: [
                  label,
                  id === "important" && importantCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground", children: importantCount })
                ]
              },
              id
            ))
          }
        ),
        filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground px-0.5", children: [
          filtered.length,
          " notice",
          filtered.length !== 1 ? "s" : ""
        ] }),
        filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Bell,
            title: "No notices",
            description: activeFilter === "important" ? "No important notices at the moment." : activeFilter === "class" ? "No student-specific notices yet." : "School notices and updates will appear here.",
            "data-ocid": "empty-notifications"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", "data-ocid": "notices-list", children: [...filtered].sort((a, b) => {
          if (a.isImportant && !b.isImportant) return -1;
          if (!a.isImportant && b.isImportant) return 1;
          return Number(b.createdAt) - Number(a.createdAt);
        }).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "bg-card border border-border rounded-xl p-4 shadow-card",
              n.isImportant ? "border-l-4 border-l-destructive" : "role-student"
            ),
            "data-ocid": `notice-${n.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      n.isImportant ? "bg-destructive/10" : "bg-muted"
                    ),
                    children: n.isImportant ? /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 14, className: "text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 14, className: "text-muted-foreground" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground leading-tight", children: n.title }),
                    n.isImportant && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-[9px] font-bold px-1.5 py-0 bg-destructive/10 text-destructive border-destructive/30",
                        children: "IMPORTANT"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    n.audience === "all" ? "All" : "Students",
                    " ·",
                    " ",
                    new Date(
                      Number(n.createdAt) / 1e6
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: n.content }),
              n.createdBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2 font-medium", children: [
                "— ",
                n.createdBy
              ] })
            ]
          },
          n.id
        )) })
      ] })
    }
  );
}
export {
  StudentNotifications as default
};
