import { j as jsxRuntimeExports, c as cn } from "./index-BBwbkILB.js";
import { B as Button } from "./graduation-cap-D7guj77i.js";
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": dataOcid,
      className: cn(
        "flex flex-col items-center justify-center text-center px-6 py-12 gap-4",
        className
      ),
      children: [
        Icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 28, className: "text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-base text-foreground", children: title }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto", children: description })
        ] }),
        actionLabel && onAction && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: onAction,
            size: "sm",
            className: "mt-1",
            "data-ocid": "empty-state-action",
            children: actionLabel
          }
        )
      ]
    }
  );
}
export {
  EmptyState as E
};
