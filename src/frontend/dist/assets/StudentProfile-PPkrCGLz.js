import { u as useNavigate, a as useAuth, j as jsxRuntimeExports, P as PageLoader } from "./index-BBwbkILB.js";
import { L as Layout, U as User, a as Badge, b as LogOut } from "./Layout-8MqYqfzj.js";
import { G as GraduationCap, B as Button } from "./graduation-cap-D7guj77i.js";
import { S as Separator } from "./separator-BWrjtQPi.js";
import { b as useStudents } from "./useBackend-slhkZeTo.js";
import { H as Hash } from "./hash-B_7wmlE_.js";
import { B as BookOpen } from "./book-open-CnWzzPJQ.js";
import { C as Calendar } from "./calendar-B_HBu5f3.js";
import { P as Phone } from "./phone-nvIX5Em0.js";
import "./index-B3XdCMvE.js";
function InfoRow({ icon: Icon, label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, className: "text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mt-0.5 break-words", children: value || "—" })
    ] })
  ] });
}
function StudentProfile() {
  const navigate = useNavigate();
  const { userProfile, role, logout } = useAuth();
  const { data: students, isLoading } = useStudents();
  const student = students == null ? void 0 : students.find(
    (s) => s.grNo === (userProfile == null ? void 0 : userProfile.roleId) || s.id === (userProfile == null ? void 0 : userProfile.id)
  );
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      activeTab: "profile",
      onTabChange: handleTabChange,
      title: "My Profile",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-2xl p-5 shadow-card role-student",
            "data-ocid": "profile-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 28, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground leading-tight truncate", children: (userProfile == null ? void 0 : userProfile.name) ?? "Student" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
                    "GR No: ",
                    (userProfile == null ? void 0 : userProfile.roleId) ?? "—"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs font-semibold px-2 py-0.5 bg-muted text-muted-foreground border-border",
                      children: role.charAt(0).toUpperCase() + role.slice(1)
                    }
                  ) })
                ] })
              ] }),
              student && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: Hash, label: "GR Number", value: student.grNo }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      icon: GraduationCap,
                      label: "Class & Section",
                      value: student.className ? `${student.className} – ${student.section}` : student.section ?? "—"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      icon: BookOpen,
                      label: "Admission Date",
                      value: student.admissionDate ? new Date(student.admissionDate).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "long", year: "numeric" }
                      ) : "—"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      icon: Calendar,
                      label: "Date of Birth",
                      value: student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "long", year: "numeric" }
                      ) : "—"
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        student && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-4 shadow-card",
            "data-ocid": "parent-contact",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-2", children: "Parent / Guardian" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  InfoRow,
                  {
                    icon: User,
                    label: "Parent Name",
                    value: student.parentName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  InfoRow,
                  {
                    icon: Phone,
                    label: "Contact Number",
                    value: student.contactNumber
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/5 gap-2",
            onClick: () => {
              logout();
              navigate({ to: "/login" });
            },
            "data-ocid": "btn-logout-profile",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 }),
              "Sign Out"
            ]
          }
        )
      ] })
    }
  );
}
export {
  StudentProfile as default
};
