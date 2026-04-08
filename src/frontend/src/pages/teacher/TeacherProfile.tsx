import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  LogOut,
  Mail,
  Phone,
  User,
} from "lucide-react";
import type { TabId } from "../../components/BottomNav";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useTeachers } from "../../hooks/useBackend";

interface ProfileRowProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}

function ProfileRow({ icon: Icon, label, value }: ProfileRowProps) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function TeacherProfile() {
  const navigate = useNavigate();
  const { userProfile, role, logout } = useAuth();
  const { data: teachers, isLoading } = useTeachers();

  const currentTeacher = teachers?.find(
    (t) => t.teacherId === userProfile?.roleId,
  );

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };

  if (isLoading) return <PageLoader />;

  return (
    <Layout activeTab="profile" onTabChange={handleTabChange} title="Profile">
      <div className="px-4 pt-5 pb-4 space-y-4">
        {/* Avatar + name card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-card role-teacher">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
              <User size={28} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-xl text-foreground truncate">
                {currentTeacher?.name ?? userProfile?.name ?? "Teacher"}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                ID: {currentTeacher?.teacherId ?? userProfile?.roleId}
              </p>
              <Badge
                variant="outline"
                className="mt-1.5 text-xs font-semibold text-accent border-accent/30 bg-accent/5"
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile details */}
        {currentTeacher && (
          <div className="bg-card border border-border rounded-2xl px-4 shadow-card divide-y divide-border">
            <ProfileRow
              icon={BookOpen}
              label="Subject"
              value={currentTeacher.subject}
            />
            <ProfileRow
              icon={GraduationCap}
              label="Assigned Classes"
              value={
                currentTeacher.assignedClasses.length > 0
                  ? currentTeacher.assignedClasses.join(", ")
                  : "None"
              }
            />
            {currentTeacher.contactNumber && (
              <ProfileRow
                icon={Phone}
                label="Contact"
                value={currentTeacher.contactNumber}
              />
            )}
            {currentTeacher.email && (
              <ProfileRow
                icon={Mail}
                label="Email"
                value={currentTeacher.email}
              />
            )}
            {currentTeacher.joinDate && (
              <ProfileRow
                icon={CalendarDays}
                label="Joined"
                value={new Date(currentTeacher.joinDate).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              />
            )}
          </div>
        )}

        <Separator />

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/5"
          onClick={() => {
            logout();
            navigate({ to: "/login" });
          }}
          data-ocid="btn-logout-profile"
        >
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>
    </Layout>
  );
}
