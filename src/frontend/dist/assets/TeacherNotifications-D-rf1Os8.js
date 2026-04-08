import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, P as PageLoader } from "./index-BBwbkILB.js";
import { L as Layout, B as Bell, a as Badge } from "./Layout-8MqYqfzj.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { a as useNotices } from "./useBackend-slhkZeTo.js";
import { M as Megaphone } from "./megaphone-CLLx7x11.js";
import "./graduation-cap-D7guj77i.js";
const TABS = [
  { id: "all", label: "All" },
  { id: "teacher", label: "Teachers" }
];
function formatDate(ts) {
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function TeacherNotifications() {
  const navigate = useNavigate();
  const { data: notices, isLoading } = useNotices();
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "profile") navigate({ to: "/teacher/profile" });
  };
  const base = (notices ?? []).filter(
    (n) => n.audience === "teacher" || n.audience === "all"
  );
  const filtered = activeTab === "all" ? base : base.filter((n) => n.audience === activeTab);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      activeTab: "notifications",
      onTabChange: handleTabChange,
      title: "Notices",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(t.id),
            className: `px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth ${activeTab === t.id ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border hover:border-accent/50"}`,
            "data-ocid": `filter-${t.id}`,
            children: t.label
          },
          t.id
        )) }),
        filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Bell,
            title: "No notices",
            description: "Important updates for teachers will appear here.",
            "data-ocid": "empty-notifications"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `bg-card border border-border rounded-xl p-4 shadow-card ${n.isImportant ? "border-l-4 border-l-destructive" : "role-teacher"}`,
            "data-ocid": `notice-${n.id}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 15, className: "text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground leading-snug flex-1 min-w-0", children: n.title }),
                  n.isImportant && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-[10px] shrink-0 text-destructive border-destructive/30 bg-destructive/5",
                      children: "Important"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: n.content }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: formatDate(n.createdAt) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-[10px] text-muted-foreground border-border",
                      children: n.audience === "all" ? "Everyone" : "Teachers"
                    }
                  )
                ] })
              ] })
            ] })
          },
          n.id
        )) })
      ] })
    }
  );
}
export {
  TeacherNotifications as default
};
