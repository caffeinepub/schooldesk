import { j as jsxRuntimeExports, c as cn, a as useAuth, r as reactExports } from "./index-BBwbkILB.js";
import { c as createLucideIcon, S as Slot, e as cva, G as GraduationCap, B as Button } from "./graduation-cap-D7guj77i.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
const tabs = [
  { id: "home", label: "Home", icon: House },
  { id: "notifications", label: "Notices", icon: Bell },
  { id: "profile", label: "Profile", icon: User }
];
function BottomNav({ activeTab, onTabChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "nav",
    {
      className: "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elevated",
      "data-ocid": "bottom-nav",
      style: { paddingBottom: "env(safe-area-inset-bottom)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-stretch max-w-lg mx-auto", children: tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onTabChange(id),
            className: cn(
              "relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] transition-smooth",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            ),
            "aria-label": label,
            "data-ocid": `nav-tab-${id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Icon,
                {
                  size: 22,
                  strokeWidth: isActive ? 2.5 : 1.8,
                  className: cn("transition-smooth", isActive && "scale-110")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "text-[10px] font-medium tracking-wide transition-smooth",
                    isActive ? "font-semibold" : "font-medium"
                  ),
                  children: label
                }
              ),
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" })
            ]
          },
          id
        );
      }) })
    }
  );
}
const ROLE_LABELS = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  unknown: "Guest"
};
const ROLE_CLASSES = {
  admin: "bg-primary/10 text-primary border-primary/30",
  teacher: "bg-accent/10 text-accent border-accent/30",
  student: "bg-muted text-muted-foreground border-border",
  unknown: "bg-muted text-muted-foreground border-border"
};
function Layout({
  children,
  activeTab = "home",
  onTabChange,
  showNav = true,
  title,
  rightAction
}) {
  const { role, userProfile, logout } = useAuth();
  const [localTab, setLocalTab] = reactExports.useState(activeTab);
  const handleTabChange = (tab) => {
    setLocalTab(tab);
    onTabChange == null ? void 0 : onTabChange(tab);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 bg-card border-b border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 h-14 max-w-lg mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 22, className: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-foreground tracking-tight", children: title ?? "SchoolDesk" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        userProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: cn(
              "text-xs font-semibold px-2 py-0.5 border",
              ROLE_CLASSES[role] ?? ROLE_CLASSES.unknown
            ),
            children: ROLE_LABELS[role] ?? "Guest"
          }
        ),
        rightAction,
        userProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: logout,
            "aria-label": "Logout",
            className: "h-8 w-8 text-muted-foreground hover:text-destructive",
            "data-ocid": "btn-logout",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "main",
      {
        className: cn("flex-1 max-w-lg mx-auto w-full", showNav && "pb-20"),
        children
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "footer",
      {
        className: cn(
          "max-w-lg mx-auto w-full px-4 py-3 text-center text-xs text-muted-foreground bg-muted/40",
          showNav && "mb-16"
        ),
        children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ".",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : ""
              )}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:text-foreground transition-colors",
              children: "Built with love using caffeine.ai"
            }
          )
        ]
      }
    ),
    showNav && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BottomNav,
      {
        activeTab: onTabChange ? activeTab : localTab,
        onTabChange: handleTabChange
      }
    )
  ] });
}
export {
  Bell as B,
  Layout as L,
  User as U,
  Badge as a,
  LogOut as b
};
