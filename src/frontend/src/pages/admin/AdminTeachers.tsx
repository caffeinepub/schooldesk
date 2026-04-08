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
import {
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { StatusBadge } from "../../components/StatusBadge";
import {
  useCreateTeacher,
  useDeleteTeacher,
  useTeachers,
  useUpdateTeacher,
} from "../../hooks/useBackend";
import type { CreateTeacherPayload, Teacher } from "../../types";

const EMPTY_FORM: CreateTeacherPayload = {
  teacherId: "",
  name: "",
  subject: "",
  assignedClasses: [],
  contactNumber: "",
  email: "",
  joinDate: "",
};

const SCALAR_FIELDS: [keyof CreateTeacherPayload, string, string, boolean][] = [
  ["teacherId", "Teacher ID", "text", true],
  ["name", "Full Name", "text", true],
  ["subject", "Subject", "text", true],
  ["contactNumber", "Contact Number", "tel", true],
  ["email", "Email Address", "email", false],
  ["joinDate", "Join Date", "date", false],
];

export default function AdminTeachers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Teacher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const [form, setForm] = useState<CreateTeacherPayload>(EMPTY_FORM);
  const [classesInput, setClassesInput] = useState("");

  const { data: teachers = [], isLoading } = useTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.teacherId.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q),
    );
  }, [teachers, search]);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setClassesInput("");
    setShowForm(true);
  }

  function openEdit(t: Teacher) {
    setEditTarget(t);
    setForm({
      teacherId: t.teacherId,
      name: t.name,
      subject: t.subject,
      assignedClasses: t.assignedClasses,
      contactNumber: t.contactNumber,
      email: t.email,
      joinDate: t.joinDate,
    });
    setClassesInput(t.assignedClasses.join(", "));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreateTeacherPayload = {
      ...form,
      assignedClasses: classesInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };
    try {
      if (editTarget) {
        await updateTeacher.mutateAsync({
          id: editTarget.id,
          payload: payload as unknown as Record<string, unknown>,
        });
        toast.success("Teacher updated");
      } else {
        await createTeacher.mutateAsync(
          payload as unknown as Record<string, unknown>,
        );
        toast.success("Teacher added");
      }
      setShowForm(false);
    } catch {
      toast.error("Operation failed. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteTeacher.mutateAsync(deleteTarget.id);
      toast.success("Teacher removed");
      setDeleteTarget(null);
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <Layout
      activeTab="home"
      onTabChange={handleTabChange}
      title="Teachers"
      rightAction={
        <Button
          size="sm"
          className="h-8 gap-1"
          onClick={openAdd}
          data-ocid="btn-add-teacher"
        >
          <Plus size={14} /> Add
        </Button>
      }
    >
      <div className="px-4 pt-4 pb-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          {teachers.length} staff members
        </p>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, subject…"
            className="pl-9 h-10"
            data-ocid="search-teachers"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner label="Loading teachers…" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title={search ? "No teachers found" : "No teachers yet"}
            description={
              search
                ? "Try a different search term."
                : "Add your first teacher to get started."
            }
            actionLabel={!search ? "Add Teacher" : undefined}
            onAction={!search ? openAdd : undefined}
            data-ocid="empty-teachers"
          />
        ) : (
          <div className="space-y-2" data-ocid="teachers-list">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-card border border-border rounded-xl p-3.5 shadow-card role-teacher"
                data-ocid={`teacher-row-${t.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {t.name}
                      </p>
                      <StatusBadge
                        status={t.isActive ? "active" : "inactive"}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-xs bg-accent/5 text-accent border-accent/20"
                      >
                        {t.teacherId}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {t.subject}
                      </span>
                    </div>
                    {t.assignedClasses.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {t.assignedClasses.map((cls) => (
                          <Badge
                            key={cls}
                            variant="outline"
                            className="text-xs"
                          >
                            {cls}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone size={11} /> {t.contactNumber}
                      </span>
                      {t.email && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                          <Mail size={11} />
                          <span className="truncate">{t.email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      aria-label="Edit teacher"
                      onClick={() => openEdit(t)}
                      data-ocid={`btn-edit-teacher-${t.id}`}
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      aria-label="Delete teacher"
                      onClick={() => setDeleteTarget(t)}
                      data-ocid={`btn-delete-teacher-${t.id}`}
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
              {editTarget ? "Edit Teacher" : "Add Teacher"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            {SCALAR_FIELDS.map(([field, labelText, type, required]) => (
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
                  value={form[field] as string}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  className="mt-1"
                  data-ocid={`input-${field}`}
                />
              </div>
            ))}
            <div>
              <Label
                htmlFor="field-assignedClasses"
                className="text-xs font-medium"
              >
                Assigned Classes{" "}
                <span className="text-muted-foreground">(comma-separated)</span>
              </Label>
              <Input
                id="field-assignedClasses"
                placeholder="e.g. Grade 7, Grade 8"
                value={classesInput}
                onChange={(e) => setClassesInput(e.target.value)}
                className="mt-1"
                data-ocid="input-assignedClasses"
              />
            </div>
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
                disabled={createTeacher.isPending || updateTeacher.isPending}
                data-ocid="btn-save-teacher"
              >
                {createTeacher.isPending || updateTeacher.isPending
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
            <AlertDialogTitle>Remove Teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.name}</strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="btn-confirm-delete-teacher"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
