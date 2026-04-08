import { u as useNavigate, j as jsxRuntimeExports, L as LoadingSpinner, c as cn } from "./index-BBwbkILB.js";
import { L as Layout, B as Bell, a as Badge } from "./Layout-8MqYqfzj.js";
import { B as Button } from "./graduation-cap-D7guj77i.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { a as useNotices } from "./useBackend-slhkZeTo.js";
import { B as BellDot } from "./bell-dot-COxOQT7n.js";
const AUDIENCE_LABELS = {
  all: "Everyone",
  admin: "Admin",
  teacher: "Teachers",
  student: "Students"
};
const AUDIENCE_COLORS = {
  all: "bg-primary/10 text-primary border-primary/20",
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  teacher: "bg-accent/10 text-accent border-accent/20",
  student: "bg-secondary text-secondary-foreground border-border"
};
function formatTs(ts) {
  try {
    const d = new Date(Number(ts) / 1e6);
    const diffDays = Math.floor((Date.now() - d.getTime()) / 864e5);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "—";
  }
}
function AdminNotifications() {
  const navigate = useNavigate();
  const { data: notices = [], isLoading } = useNotices();
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
  };
  const sorted = [...notices].sort((a, b) => Number(b.createdAt - a.createdAt));
  const important = sorted.filter((n) => n.isImportant);
  const regular = sorted.filter((n) => !n.isImportant);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      activeTab: "notifications",
      onTabChange: handleTabChange,
      title: "Notifications",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          notices.length,
          " notice",
          notices.length !== 1 ? "s" : "",
          " posted"
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { label: "Loading notifications…" }) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Bell,
            title: "No notifications yet",
            description: "Important notices and alerts will appear here.",
            actionLabel: "Post a Notice",
            onAction: () => navigate({ to: "/admin/notices" }),
            "data-ocid": "empty-notifications"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          important.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2", children: "Important" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: important.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-card border border-border border-l-4 border-l-primary rounded-xl p-3.5 shadow-card",
                "data-ocid": `notification-important-${n.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BellDot, { size: 14, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground flex-1 min-w-0 truncate", children: n.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap flex-shrink-0", children: formatTs(n.createdAt) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: n.content }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: cn(
                          "text-xs border mt-1.5",
                          AUDIENCE_COLORS[n.audience]
                        ),
                        children: AUDIENCE_LABELS[n.audience]
                      }
                    )
                  ] })
                ] })
              },
              n.id
            )) })
          ] }),
          regular.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2", children: "General" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: regular.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-card border border-border rounded-xl p-3.5 shadow-card",
                "data-ocid": `notification-row-${n.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 14, className: "text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground flex-1 min-w-0 truncate", children: n.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap flex-shrink-0", children: formatTs(n.createdAt) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: n.content }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: cn(
                          "text-xs border mt-1.5",
                          AUDIENCE_COLORS[n.audience]
                        ),
                        children: AUDIENCE_LABELS[n.audience]
                      }
                    )
                  ] })
                ] })
              },
              n.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full text-xs",
              onClick: () => navigate({ to: "/admin/notices" }),
              "data-ocid": "btn-manage-notices",
              children: "Manage All Notices"
            }
          ) })
        ] })
      ] })
    }
  );
}
export {
  AdminNotifications as default
};
