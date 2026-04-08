import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { PageLoader } from "./components/LoadingSpinner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { UserRole } from "./types";

// ─── Lazy page imports ────────────────────────────────────────────────────────

const LoginPage = lazy(() => import("./pages/LoginPage"));

const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const AdminStudents = lazy(() => import("./pages/admin/AdminStudents"));
const AdminTeachers = lazy(() => import("./pages/admin/AdminTeachers"));
const AdminFees = lazy(() => import("./pages/admin/AdminFees"));
const AdminAttendance = lazy(() => import("./pages/admin/AdminAttendance"));
const AdminNotices = lazy(() => import("./pages/admin/AdminNotices"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const AdminNotifications = lazy(
  () => import("./pages/admin/AdminNotifications"),
);

const TeacherHome = lazy(() => import("./pages/teacher/TeacherHome"));
const TeacherHomework = lazy(() => import("./pages/teacher/TeacherHomework"));
const TeacherMarks = lazy(() => import("./pages/teacher/TeacherMarks"));
const TeacherAttendance = lazy(
  () => import("./pages/teacher/TeacherAttendance"),
);
const TeacherProfile = lazy(() => import("./pages/teacher/TeacherProfile"));
const TeacherNotifications = lazy(
  () => import("./pages/teacher/TeacherNotifications"),
);

const StudentHome = lazy(() => import("./pages/student/StudentHome"));
const StudentFees = lazy(() => import("./pages/student/StudentFees"));
const StudentMarks = lazy(() => import("./pages/student/StudentMarks"));
const StudentAttendance = lazy(
  () => import("./pages/student/StudentAttendance"),
);
const StudentHomework = lazy(() => import("./pages/student/StudentHomework"));
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const StudentNotifications = lazy(
  () => import("./pages/student/StudentNotifications"),
);

// ─── Route Guard ─────────────────────────────────────────────────────────────

function RouteGuard({
  requiredRole,
  children,
}: {
  requiredRole: UserRole;
  children: React.ReactNode;
}) {
  const { role: userRole, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (userRole !== "unknown" && userRole !== requiredRole) {
    const homeMap: Record<string, string> = {
      admin: "/admin",
      teacher: "/teacher",
      student: "/student",
    };
    return <Navigate to={homeMap[userRole] ?? "/login"} />;
  }
  return <>{children}</>;
}

// ─── Route helpers ────────────────────────────────────────────────────────────

function wrap(Component: React.ComponentType, requiredRole: UserRole) {
  return function WrappedRoute() {
    return (
      <RouteGuard requiredRole={requiredRole}>
        <Suspense fallback={<PageLoader />}>
          <Component />
        </Suspense>
      </RouteGuard>
    );
  };
}

// ─── Root Layout ─────────────────────────────────────────────────────────────

function RootLayout() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
      <Toaster position="top-center" richColors />
    </Suspense>
  );
}

// ─── Index redirect ───────────────────────────────────────────────────────────

function IndexRedirect() {
  const { role, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role === "admin") return <Navigate to="/admin" />;
  if (role === "teacher") return <Navigate to="/teacher" />;
  if (role === "student") return <Navigate to="/student" />;
  return <Navigate to="/login" />;
}

// ─── Router definition ───────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexRedirect,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  ),
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: wrap(AdminHome, "admin"),
});
const adminStudentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/students",
  component: wrap(AdminStudents, "admin"),
});
const adminTeachersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/teachers",
  component: wrap(AdminTeachers, "admin"),
});
const adminFeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/fees",
  component: wrap(AdminFees, "admin"),
});
const adminAttendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/attendance",
  component: wrap(AdminAttendance, "admin"),
});
const adminNoticesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/notices",
  component: wrap(AdminNotices, "admin"),
});
const adminProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/profile",
  component: wrap(AdminProfile, "admin"),
});
const adminNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/notifications",
  component: wrap(AdminNotifications, "admin"),
});

// Teacher routes
const teacherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher",
  component: wrap(TeacherHome, "teacher"),
});
const teacherHomeworkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher/homework",
  component: wrap(TeacherHomework, "teacher"),
});
const teacherMarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher/marks",
  component: wrap(TeacherMarks, "teacher"),
});
const teacherAttendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher/attendance",
  component: wrap(TeacherAttendance, "teacher"),
});
const teacherProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher/profile",
  component: wrap(TeacherProfile, "teacher"),
});
const teacherNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher/notifications",
  component: wrap(TeacherNotifications, "teacher"),
});

// Student routes
const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student",
  component: wrap(StudentHome, "student"),
});
const studentFeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/fees",
  component: wrap(StudentFees, "student"),
});
const studentMarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/marks",
  component: wrap(StudentMarks, "student"),
});
const studentAttendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/attendance",
  component: wrap(StudentAttendance, "student"),
});
const studentHomeworkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/homework",
  component: wrap(StudentHomework, "student"),
});
const studentProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/profile",
  component: wrap(StudentProfile, "student"),
});
const studentNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/notifications",
  component: wrap(StudentNotifications, "student"),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute,
  adminStudentsRoute,
  adminTeachersRoute,
  adminFeesRoute,
  adminAttendanceRoute,
  adminNoticesRoute,
  adminProfileRoute,
  adminNotificationsRoute,
  teacherRoute,
  teacherHomeworkRoute,
  teacherMarksRoute,
  teacherAttendanceRoute,
  teacherProfileRoute,
  teacherNotificationsRoute,
  studentRoute,
  studentFeesRoute,
  studentMarksRoute,
  studentAttendanceRoute,
  studentHomeworkRoute,
  studentProfileRoute,
  studentNotificationsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App entry ───────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
