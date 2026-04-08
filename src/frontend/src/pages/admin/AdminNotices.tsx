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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Bell, BellDot, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  useCreateNotice,
  useDeleteNotice,
  useNotices,
} from "../../hooks/useBackend";
import type { Notice, NoticeAudience } from "../../types";

const AUDIENCE_LABELS: Record<NoticeAudience, string> = {
  all: "Everyone",
  admin: "Admin",
  teacher: "Teachers",
  student: "Students",
};

const AUDIENCE_COLORS: Record<NoticeAudience, string> = {
  all: "bg-primary/10 text-primary border-primary/20",
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  teacher: "bg-accent/10 text-accent border-accent/20",
  student: "bg-secondary text-secondary-foreground border-border",
};

function formatTs(ts: bigint): string {
  try {
    const d = new Date(Number(ts) / 1_000_000);
    const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function AdminNotices() {
  const navigate = useNavigate();
  const { data: notices = [], isLoading } = useNotices();
  const createNotice = useCreateNotice();
  const deleteNotice = useDeleteNotice();

  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    audience: "all" as NoticeAudience,
    isImportant: false,
  });

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    try {
      await createNotice.mutateAsync(form);
      toast.success("Notice published");
      setShowForm(false);
      setForm({ title: "", content: "", audience: "all", isImportant: false });
    } catch {
      toast.error("Failed to publish notice");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteNotice.mutateAsync(deleteTarget.id);
      toast.success("Notice deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <Layout
      activeTab="notifications"
      onTabChange={handleTabChange}
      title="Notices"
      rightAction={
        <Button
          size="sm"
          className="h-8 gap-1"
          onClick={() => setShowForm(true)}
          data-ocid="btn-add-notice"
        >
          <Plus size={14} /> Post
        </Button>
      }
    >
      <div className="px-4 pt-4 pb-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          {notices.length} notices posted
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner label="Loading notices…" />
          </div>
        ) : notices.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notices yet"
            description="Post a notice to inform students and teachers."
            actionLabel="Post Notice"
            onAction={() => setShowForm(true)}
            data-ocid="empty-notices"
          />
        ) : (
          <div className="space-y-2" data-ocid="notices-list">
            {[...notices]
              .sort((a, b) => Number(b.createdAt - a.createdAt))
              .map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "bg-card border border-border rounded-xl p-4 shadow-card",
                    n.isImportant && "border-l-4 border-l-primary",
                  )}
                  data-ocid={`notice-row-${n.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {n.isImportant ? (
                          <BellDot
                            size={13}
                            className="text-primary flex-shrink-0"
                          />
                        ) : (
                          <Bell
                            size={13}
                            className="text-muted-foreground flex-shrink-0"
                          />
                        )}
                        <p className="font-semibold text-sm text-foreground truncate">
                          {n.title}
                        </p>
                        {n.isImportant && (
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                        {n.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs border",
                            AUDIENCE_COLORS[n.audience],
                          )}
                        >
                          {AUDIENCE_LABELS[n.audience]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTs(n.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                      aria-label="Delete notice"
                      onClick={() => setDeleteTarget(n)}
                      data-ocid={`btn-delete-notice-${n.id}`}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Create Notice Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Post New Notice</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="notice-title" className="text-xs font-medium">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="notice-title"
                required
                placeholder="e.g. Holiday Notice — Diwali"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="mt-1"
                data-ocid="input-notice-title"
              />
            </div>
            <div>
              <Label htmlFor="notice-content" className="text-xs font-medium">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="notice-content"
                required
                placeholder="Write the notice content here…"
                rows={4}
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                className="mt-1 resize-none"
                data-ocid="input-notice-content"
              />
            </div>
            <div>
              <Label htmlFor="notice-audience" className="text-xs font-medium">
                Audience
              </Label>
              <div className="relative mt-1">
                <select
                  id="notice-audience"
                  value={form.audience}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      audience: e.target.value as NoticeAudience,
                    }))
                  }
                  className="w-full appearance-none bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8"
                  data-ocid="select-notice-audience"
                >
                  <option value="all">Everyone</option>
                  <option value="teacher">Teachers only</option>
                  <option value="student">Students only</option>
                  <option value="admin">Admin only</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Mark as Important
                </p>
                <p className="text-xs text-muted-foreground">
                  Will be highlighted prominently
                </p>
              </div>
              <Switch
                checked={form.isImportant}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isImportant: v }))
                }
                data-ocid="switch-important"
              />
            </div>
            <div className="flex gap-2">
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
                disabled={createNotice.isPending}
                data-ocid="btn-publish-notice"
              >
                {createNotice.isPending ? "Publishing…" : "Publish"}
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
            <AlertDialogTitle>Delete Notice?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="btn-confirm-delete-notice"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
