import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, b as ue } from "./index-BBwbkILB.js";
import { T as Trash2, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-B_VaJ0VW.js";
import { L as Layout, a as Badge } from "./Layout-8MqYqfzj.js";
import { G as GraduationCap, B as Button } from "./graduation-cap-D7guj77i.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DqYXynMa.js";
import { I as Input, L as Label } from "./label-C0UuxCOR.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { S as StatusBadge } from "./StatusBadge-YQKFDOVw.js";
import { f as useTeachers, g as useCreateTeacher, h as useUpdateTeacher, i as useDeleteTeacher } from "./useBackend-slhkZeTo.js";
import { S as Search, P as Pencil } from "./search-By0uA5ya.js";
import { P as Phone } from "./phone-nvIX5Em0.js";
import { M as Mail } from "./mail-BHJx7_XI.js";
import { P as Plus } from "./plus-EoiM-lKm.js";
import "./x-GY-xxyRz.js";
import "./index-B3XdCMvE.js";
const EMPTY_FORM = {
  teacherId: "",
  name: "",
  subject: "",
  assignedClasses: [],
  contactNumber: "",
  email: "",
  joinDate: ""
};
const SCALAR_FIELDS = [
  ["teacherId", "Teacher ID", "text", true],
  ["name", "Full Name", "text", true],
  ["subject", "Subject", "text", true],
  ["contactNumber", "Contact Number", "tel", true],
  ["email", "Email Address", "email", false],
  ["joinDate", "Join Date", "date", false]
];
function AdminTeachers() {
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [classesInput, setClassesInput] = reactExports.useState("");
  const { data: teachers = [], isLoading } = useTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return teachers.filter(
      (t) => t.name.toLowerCase().includes(q) || t.teacherId.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
    );
  }, [teachers, search]);
  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setClassesInput("");
    setShowForm(true);
  }
  function openEdit(t) {
    setEditTarget(t);
    setForm({
      teacherId: t.teacherId,
      name: t.name,
      subject: t.subject,
      assignedClasses: t.assignedClasses,
      contactNumber: t.contactNumber,
      email: t.email,
      joinDate: t.joinDate
    });
    setClassesInput(t.assignedClasses.join(", "));
    setShowForm(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      assignedClasses: classesInput.split(",").map((c) => c.trim()).filter(Boolean)
    };
    try {
      if (editTarget) {
        await updateTeacher.mutateAsync({
          id: editTarget.id,
          payload
        });
        ue.success("Teacher updated");
      } else {
        await createTeacher.mutateAsync(
          payload
        );
        ue.success("Teacher added");
      }
      setShowForm(false);
    } catch {
      ue.error("Operation failed. Please try again.");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteTeacher.mutateAsync(deleteTarget.id);
      ue.success("Teacher removed");
      setDeleteTarget(null);
    } catch {
      ue.error("Delete failed");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Layout,
    {
      activeTab: "home",
      onTabChange: handleTabChange,
      title: "Teachers",
      rightAction: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "h-8 gap-1",
          onClick: openAdd,
          "data-ocid": "btn-add-teacher",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            " Add"
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            teachers.length,
            " staff members"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Search,
              {
                size: 15,
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Search by name, ID, subject…",
                className: "pl-9 h-10",
                "data-ocid": "search-teachers"
              }
            )
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { label: "Loading teachers…" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: GraduationCap,
              title: search ? "No teachers found" : "No teachers yet",
              description: search ? "Try a different search term." : "Add your first teacher to get started.",
              actionLabel: !search ? "Add Teacher" : void 0,
              onAction: !search ? openAdd : void 0,
              "data-ocid": "empty-teachers"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "teachers-list", children: filtered.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-card border border-border rounded-xl p-3.5 shadow-card role-teacher",
              "data-ocid": `teacher-row-${t.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: t.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StatusBadge,
                      {
                        status: t.isActive ? "active" : "inactive"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs bg-accent/5 text-accent border-accent/20",
                        children: t.teacherId
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t.subject })
                  ] }),
                  t.assignedClasses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mt-1 flex-wrap", children: t.assignedClasses.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs",
                      children: cls
                    },
                    cls
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
                      " ",
                      t.contactNumber
                    ] }),
                    t.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 11 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: t.email })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-muted-foreground hover:text-primary",
                      "aria-label": "Edit teacher",
                      onClick: () => openEdit(t),
                      "data-ocid": `btn-edit-teacher-${t.id}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 12 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                      "aria-label": "Delete teacher",
                      onClick: () => setDeleteTarget(t),
                      "data-ocid": `btn-delete-teacher-${t.id}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                    }
                  )
                ] })
              ] })
            },
            t.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showForm, onOpenChange: setShowForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm mx-auto max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: editTarget ? "Edit Teacher" : "Add Teacher" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3 mt-2", children: [
            SCALAR_FIELDS.map(([field, labelText, type, required]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: `field-${field}`,
                  className: "text-xs font-medium",
                  children: [
                    labelText,
                    required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-0.5", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: `field-${field}`,
                  type,
                  required,
                  value: form[field],
                  onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
                  className: "mt-1",
                  "data-ocid": `input-${field}`
                }
              )
            ] }, field)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "field-assignedClasses",
                  className: "text-xs font-medium",
                  children: [
                    "Assigned Classes",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(comma-separated)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "field-assignedClasses",
                  placeholder: "e.g. Grade 7, Grade 8",
                  value: classesInput,
                  onChange: (e) => setClassesInput(e.target.value),
                  className: "mt-1",
                  "data-ocid": "input-assignedClasses"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1",
                  onClick: () => setShowForm(false),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  className: "flex-1",
                  disabled: createTeacher.isPending || updateTeacher.isPending,
                  "data-ocid": "btn-save-teacher",
                  children: createTeacher.isPending || updateTeacher.isPending ? "Saving…" : "Save"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialog,
          {
            open: !!deleteTarget,
            onOpenChange: (o) => !o && setDeleteTarget(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Remove Teacher?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                  "This will permanently remove ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleteTarget == null ? void 0 : deleteTarget.name }),
                  ". This action cannot be undone."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: handleDelete,
                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    "data-ocid": "btn-confirm-delete-teacher",
                    children: "Remove"
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}
export {
  AdminTeachers as default
};
