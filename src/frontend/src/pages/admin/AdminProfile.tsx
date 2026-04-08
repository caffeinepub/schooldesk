import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { GraduationCap, Hash, LogOut, ShieldCheck, User } from "lucide-react";
import type { TabId } from "../../components/BottomNav";
import { Layout } from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

export default function AdminProfile() {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const profile = userProfile;

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  const INFO_ROWS = [
    { icon: User, label: "Full Name", value: profile?.name ?? "—" },
    { icon: ShieldCheck, label: "Role", value: "Administrator" },
    {
      icon: Hash,
      label: "Admin ID",
      value: profile?.roleId ?? profile?.id ?? "—",
    },
  ] as const;

  return (
    <Layout activeTab="profile" onTabChange={handleTabChange} title="Profile">
      <div className="px-4 pt-6 pb-6 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-card">
            <GraduationCap size={36} className="text-primary" />
          </div>
          <div className="text-center">
            <h1 className="font-display font-bold text-xl text-foreground">
              {profile?.name ?? "Administrator"}
            </h1>
            <Badge
              variant="outline"
              className="mt-1 text-xs bg-primary/5 text-primary border-primary/20"
              data-ocid="role-badge"
            >
              Admin
            </Badge>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Profile Information
            </p>
          </div>
          <div className="divide-y divide-border">
            {INFO_ROWS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <Button
          variant="outline"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive"
          onClick={handleLogout}
          data-ocid="btn-logout-profile"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </Layout>
  );
}
