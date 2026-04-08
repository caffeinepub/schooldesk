import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Pencil, Phone, Plus, Search, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { StatusBadge } from "../../components/StatusBadge";
import {
  useCreateStudent,
  useDeleteStudent,
  useStudents,
  useUpdateStudent,
} from "../../hooks/useBackend";
import type { CreateStudentPayload, Student } from "../../types";

const EMPTY_FORM: CreateStudentPayload = {
  grNo: "",
  name: "",
  className: "",
  section: "",
  parentName: "",
  contactNumber: "",
  address: "",
  dateOfBirth: "",
  admissionDate: "",
};

const FIELDS: [keyof CreateStudentPayload, string, string, boolean][] = [
  ["grNo", "GR Number", "text", true],
  ["name", "Full Name", "text", true],
  ["className", "Class", "text", true],
  ["section", "Section", "text", true],
  ["parentName", "Parent / Guardian Name", "text", true],
  ["contactNumber", "Contact Number", "tel", true],
  ["dateOfBirth", "Date of Birth", "date", false],
  ["admissionDate", "Admission Date", "date", false],
  ["address", "Address", "text", false],
];

export default function AdminStudents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [form, setForm] = useState<CreateStudentPayload>(EMPTY_FORM);

  const { data: students = [], isLoading } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.grNo.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q),
    );
  }, [students, search]);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(s: Student) {
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
      admissionDate: s.admissionDate,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editTarget) {
        await updateStudent.mutateAsync({
          id: editTarget.id,
          payload: form as unknown as Record<string, unknown>,
        });
        toast.success("Student updated");
      } else {
        await createStudent.mutateAsync(
          form as unknown as Record<string, unknown>,
        );
        toast.success("Student added");
      }
      setShowForm(false);
    } catch {
      toast.error("Operation failed. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteStudent.mutateAsync(deleteTarget.id);
      toast.success("Student removed");
      setDeleteTarget(null);
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <Layout
      activeTab="home"
      onTabChange={handleTabChange}
      title="Students"
      rightAction={
        <Button
          size="sm"
          className="h-8 gap-1"
          onClick={openAdd}
          data-ocid="btn-add-student"
        >
          <Plus size={14} /> Add
        </Button>
      }
    >
      <div className="px-4 pt-4 pb-4 space-y-3">
        {/* Subtitle */}
        <p className="text-sm text-muted-foreground">
          {students.length} enrolled
        </p>

        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, GR No, class…"
            className="pl-9 h-10"
            data-ocid="search-students"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner label="Loading students…" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search ? "No students found" : "No students yet"}
            description={
              search
                ? "Try a different search term."
                : "Add your first student to get started."
            }
            actionLabel={!search ? "Add Student" : undefined}
            onAction={!search ? openAdd : undefined}
            data-ocid="empty-students"
          />
        ) : (
          <div className="space-y-2" data-ocid="students-list">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="bg-card border border-border rounded-xl p-3.5 shadow-card role-admin"
                data-ocid={`student-row-${s.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {s.name}
                      </p>
                      <StatusBadge
                        status={s.isActive ? "active" : "inactive"}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-xs bg-primary/5 text-primary border-primary/20"
                      >
                        {s.grNo}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {s.className} – {s.section}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Phone
                        size={11}
                        className="text-muted-foreground flex-shrink-0"
                      />
                      <p className="text-xs text-muted-foreground truncate">
                        {s.parentName} · {s.contactNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      aria-label="Edit student"
                      onClick={() => openEdit(s)}
                      data-ocid={`btn-edit-student-${s.id}`}
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      aria-label="Delete student"
                      onClick={() => setDeleteTarget(s)}
                      data-ocid={`btn-delete-student-${s.id}`}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editTarget ? "Edit Student" : "Add Student"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            {FIELDS.map(([field, labelText, type, required]) => (
              <div key={field}>
                <Label
                  htmlFor={`field-${field}`}
                  className="text-xs font-medium"
                >
                  {labelText}
                  {required && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </Label>
                <Input
                  id={`field-${field}`}
                  type={type}
                  required={required}
                  value={form[field]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  className="mt-1"
                  data-ocid={`input-${field}`}
                />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createStudent.isPending || updateStudent.isPending}
                data-ocid="btn-save-student"
              >
                {createStudent.isPending || updateStudent.isPending
                  ? "Saving…"
                  : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.name}</strong>{" "}
              (GR: {deleteTarget?.grNo}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="btn-confirm-delete-student"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
