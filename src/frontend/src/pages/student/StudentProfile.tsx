import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Hash,
  LogOut,
  Phone,
  User,
} from "lucide-react";
import type { TabId } from "../../components/BottomNav";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useStudents } from "../../hooks/useBackend";

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5 break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const { userProfile, role, logout } = useAuth();

  // Fetch full student record to get class, section, parent contact etc.
  const { data: students, isLoading } = useStudents();
  const student = students?.find(
    (s) => s.grNo === userProfile?.roleId || s.id === userProfile?.id,
  );

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };

  if (isLoading) return <PageLoader />;

  return (
    <Layout
      activeTab="profile"
      onTabChange={handleTabChange}
      title="My Profile"
    >
      <div className="px-4 pt-5 pb-4 space-y-4">
        {/* Profile header */}
        <div
          className="bg-card border border-border rounded-2xl p-5 shadow-card role-student"
          data-ocid="profile-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User size={28} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-lg text-foreground leading-tight truncate">
                {userProfile?.name ?? "Student"}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                GR No: {userProfile?.roleId ?? "—"}
              </p>
              <div className="mt-1.5">
                <Badge
                  variant="outline"
                  className="text-xs font-semibold px-2 py-0.5 bg-muted text-muted-foreground border-border"
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {student && (
            <>
              <Separator className="my-4" />
              <div className="divide-y divide-border">
                <InfoRow icon={Hash} label="GR Number" value={student.grNo} />
                <InfoRow
                  icon={GraduationCap}
                  label="Class & Section"
                  value={
                    student.className
                      ? `${student.className} – ${student.section}`
                      : (student.section ?? "—")
                  }
                />
                <InfoRow
                  icon={BookOpen}
                  label="Admission Date"
                  value={
                    student.admissionDate
                      ? new Date(student.admissionDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "long", year: "numeric" },
                        )
                      : "—"
                  }
                />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={
                    student.dateOfBirth
                      ? new Date(student.dateOfBirth).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "long", year: "numeric" },
                        )
                      : "—"
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* Parent / Guardian contact */}
        {student && (
          <div
            className="bg-card border border-border rounded-xl p-4 shadow-card"
            data-ocid="parent-contact"
          >
            <h3 className="font-display font-semibold text-sm text-foreground mb-2">
              Parent / Guardian
            </h3>
            <div className="divide-y divide-border">
              <InfoRow
                icon={User}
                label="Parent Name"
                value={student.parentName}
              />
              <InfoRow
                icon={Phone}
                label="Contact Number"
                value={student.contactNumber}
              />
            </div>
          </div>
        )}

        {/* Sign out */}
        <Button
          variant="outline"
          className="w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/5 gap-2"
          onClick={() => {
            logout();
            navigate({ to: "/login" });
          }}
          data-ocid="btn-logout-profile"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </Layout>
  );
}
