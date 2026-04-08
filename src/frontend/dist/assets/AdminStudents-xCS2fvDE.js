import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, b as ue } from "./index-BBwbkILB.js";
import { T as Trash2, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-B_VaJ0VW.js";
import { L as Layout, a as Badge } from "./Layout-8MqYqfzj.js";
import { B as Button } from "./graduation-cap-D7guj77i.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DqYXynMa.js";
import { I as Input, L as Label } from "./label-C0UuxCOR.js";
import { E as EmptyState } from "./EmptyState-nbGACXNB.js";
import { S as StatusBadge } from "./StatusBadge-YQKFDOVw.js";
import { b as useStudents, c as useCreateStudent, d as useUpdateStudent, e as useDeleteStudent } from "./useBackend-slhkZeTo.js";
import { S as Search, P as Pencil } from "./search-By0uA5ya.js";
import { U as Users } from "./users-CS1xEMfi.js";
import { P as Phone } from "./phone-nvIX5Em0.js";
import { P as Plus } from "./plus-EoiM-lKm.js";
import "./x-GY-xxyRz.js";
import "./index-B3XdCMvE.js";
const EMPTY_FORM = {
  grNo: "",
  name: "",
  className: "",
  section: "",
  parentName: "",
  contactNumber: "",
  address: "",
  dateOfBirth: "",
  admissionDate: ""
};
const FIELDS = [
  ["grNo", "GR Number", "text", true],
  ["name", "Full Name", "text", true],
  ["className", "Class", "text", true],
  ["section", "Section", "text", true],
  ["parentName", "Parent / Guardian Name", "text", true],
  ["contactNumber", "Contact Number", "tel", true],
  ["dateOfBirth", "Date of Birth", "date", false],
  ["admissionDate", "Admission Date", "date", false],
  ["address", "Address", "text", false]
];
function AdminStudents() {
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const { data: students = [], isLoading } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const handleTabChange = (tab) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.grNo.toLowerCase().includes(q) || s.className.toLowerCase().includes(q)
    );
  }, [students, search]);
  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }
  function openEdit(s) {
    setEditTarget(s);
    setForm({
      grNo: s.grNo,
      name: s.name,
      className: s.className,
      section: s.section,
      parentName: s.parentName,
      contactNumber: s.contactNumber,
      address: s.address,
      dateOfBirth: s.dateOfBirth,
      admissionDate: s.admissionDate
    });
    setShowForm(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editTarget) {
        await updateStudent.mutateAsync({
          id: editTarget.id,
          payload: form
        });
        ue.success("Student updated");
      } else {
        await createStudent.mutateAsync(
          form
        );
        ue.success("Student added");
      }
      setShowForm(false);
    } catch {
      ue.error("Operation failed. Please try again.");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteStudent.mutateAsync(deleteTarget.id);
      ue.success("Student removed");
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
      title: "Students",
      rightAction: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "h-8 gap-1",
          onClick: openAdd,
          "data-ocid": "btn-add-student",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            " Add"
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            students.length,
            " enrolled"
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
                placeholder: "Search by name, GR No, class…",
                className: "pl-9 h-10",
                "data-ocid": "search-students"
              }
            )
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { label: "Loading students…" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Users,
              title: search ? "No students found" : "No students yet",
              description: search ? "Try a different search term." : "Add your first student to get started.",
              actionLabel: !search ? "Add Student" : void 0,
              onAction: !search ? openAdd : void 0,
              "data-ocid": "empty-students"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "students-list", children: filtered.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-card border border-border rounded-xl p-3.5 shadow-card role-admin",
              "data-ocid": `student-row-${s.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: s.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StatusBadge,
                      {
                        status: s.isActive ? "active" : "inactive"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs bg-primary/5 text-primary border-primary/20",
                        children: s.grNo
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      s.className,
                      " – ",
                      s.section
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Phone,
                      {
                        size: 11,
                        className: "text-muted-foreground flex-shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                      s.parentName,
                      " · ",
                      s.contactNumber
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
                      "aria-label": "Edit student",
                      onClick: () => openEdit(s),
                      "data-ocid": `btn-edit-student-${s.id}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 12 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                      "aria-label": "Delete student",
                      onClick: () => setDeleteTarget(s),
                      "data-ocid": `btn-delete-student-${s.id}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                    }
                  )
                ] })
              ] })
            },
            s.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showForm, onOpenChange: setShowForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm mx-auto max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: editTarget ? "Edit Student" : "Add Student" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3 mt-2", children: [
            FIELDS.map(([field, labelText, type, required]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
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
                  disabled: createStudent.isPending || updateStudent.isPending,
                  "data-ocid": "btn-save-student",
                  children: createStudent.isPending || updateStudent.isPending ? "Saving…" : "Save"
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Remove Student?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                  "This will permanently remove ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleteTarget == null ? void 0 : deleteTarget.name }),
                  " ",
                  "(GR: ",
                  deleteTarget == null ? void 0 : deleteTarget.grNo,
                  "). This action cannot be undone."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: handleDelete,
                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    "data-ocid": "btn-confirm-delete-student",
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
  AdminStudents as default
};
