import { j as jsxRuntimeExports, c as cn } from "./index-BBwbkILB.js";
function DashboardCard({
  icon: Icon,
  iconColor,
  label,
  value,
  subValue,
  accent = "none",
  onClick,
  className,
  "data-ocid": dataOcid
}) {
  const accentClass = {
    admin: "role-admin",
    teacher: "role-teacher",
    student: "role-student",
    none: ""
  }[accent];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      onClick,
      onKeyDown: onClick ? (e) => (e.key === "Enter" || e.key === " ") && onClick() : void 0,
      "data-ocid": dataOcid,
      className: cn(
        "bg-card rounded-xl p-4 shadow-card border border-border",
        accentClass,
        onClick && "cursor-pointer hover:shadow-elevated transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 truncate", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground leading-tight", children: value }),
          subValue && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 truncate", children: subValue })
        ] }),
        Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              iconColor ?? "bg-primary/10 text-primary"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20 })
          }
        )
      ] })
    }
  );
}
export {
  DashboardCard as D
};
