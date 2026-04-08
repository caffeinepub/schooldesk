import { u as useNavigate, a as useAuth, j as jsxRuntimeExports, P as PageLoader } from "./index-BBwbkILB.js";
import { L as Layout, U as User, a as Badge, b as LogOut } from "./Layout-8MqYqfzj.js";
import { c as createLucideIcon, G as GraduationCap, B as Button } from "./graduation-cap-D7guj77i.js";
import { S as Separator } from "./separator-BWrjtQPi.js";
import { f as useTeachers } from "./useBackend-slhkZeTo.js";
import { B as BookOpen } from "./book-open-CnWzzPJQ.js";
import { P as Phone } from "./phone-nvIX5Em0.js";
import { M as Mail } from "./mail-BHJx7_XI.js";
import "./index-B3XdCMvE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode);
function ProfileRow({ icon: Icon, label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 15, className: "text-accent" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mt-0.5 break-words", children: value })
    ] })
  ] });
}
function TeacherProfile() {
  const navigate = useNavigate();
  const { userProfile, role, logout } = useAuth();
  const { data: teachers, isLoading } = useTeachers();
  const currentTeacher = teachers == null ? void 0 : teachers.find(
    (t) => t.teacherId === (userProfile == null ? void 0 : userProfile.roleId)
  );
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "profile", onTabChange: handleTabChange, title: "Profile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-card role-teacher", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 28, className: "text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground truncate", children: (currentTeacher == null ? void 0 : currentTeacher.name) ?? (userProfile == null ? void 0 : userProfile.name) ?? "Teacher" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "ID: ",
          (currentTeacher == null ? void 0 : currentTeacher.teacherId) ?? (userProfile == null ? void 0 : userProfile.roleId)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "mt-1.5 text-xs font-semibold text-accent border-accent/30 bg-accent/5",
            children: role.charAt(0).toUpperCase() + role.slice(1)
          }
        )
      ] })
    ] }) }),
    currentTeacher && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl px-4 shadow-card divide-y divide-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProfileRow,
        {
          icon: BookOpen,
          label: "Subject",
          value: currentTeacher.subject
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProfileRow,
        {
          icon: GraduationCap,
          label: "Assigned Classes",
          value: currentTeacher.assignedClasses.length > 0 ? currentTeacher.assignedClasses.join(", ") : "None"
        }
      ),
      currentTeacher.contactNumber && /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProfileRow,
        {
          icon: Phone,
          label: "Contact",
          value: currentTeacher.contactNumber
        }
      ),
      currentTeacher.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProfileRow,
        {
          icon: Mail,
          label: "Email",
          value: currentTeacher.email
        }
      ),
      currentTeacher.joinDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProfileRow,
        {
          icon: CalendarDays,
          label: "Joined",
          value: new Date(currentTeacher.joinDate).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "long",
              year: "numeric"
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        className: "w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/5",
        onClick: () => {
          logout();
          navigate({ to: "/login" });
        },
        "data-ocid": "btn-logout-profile",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16, className: "mr-2" }),
          " Sign Out"
        ]
      }
    )
  ] }) });
}
export {
  TeacherProfile as default
};
