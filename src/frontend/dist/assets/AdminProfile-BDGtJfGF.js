import { u as useNavigate, a as useAuth, j as jsxRuntimeExports } from "./index-BBwbkILB.js";
import { U as User, L as Layout, a as Badge, b as LogOut } from "./Layout-8MqYqfzj.js";
import { c as createLucideIcon, G as GraduationCap, B as Button } from "./graduation-cap-D7guj77i.js";
import { S as Separator } from "./separator-BWrjtQPi.js";
import { H as Hash } from "./hash-B_7wmlE_.js";
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
function AdminProfile() {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const profile = userProfile;
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };
  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }
  const INFO_ROWS = [
    { icon: User, label: "Full Name", value: (profile == null ? void 0 : profile.name) ?? "—" },
    { icon: ShieldCheck, label: "Role", value: "Administrator" },
    {
      icon: Hash,
      label: "Admin ID",
      value: (profile == null ? void 0 : profile.roleId) ?? (profile == null ? void 0 : profile.id) ?? "—"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "profile", onTabChange: handleTabChange, title: "Profile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 pb-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 36, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground", children: (profile == null ? void 0 : profile.name) ?? "Administrator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "mt-1 text-xs bg-primary/5 text-primary border-primary/20",
            "data-ocid": "role-badge",
            children: "Admin"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Profile Information" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: INFO_ROWS.map(({ icon: Icon, label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: value })
        ] })
      ] }, label)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        className: "w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive",
        onClick: handleLogout,
        "data-ocid": "btn-logout-profile",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16, className: "mr-2" }),
          "Sign Out"
        ]
      }
    )
  ] }) });
}
export {
  AdminProfile as default
};
