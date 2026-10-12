import { Layout } from "@/components/Layout";
import { SessionProvider } from "@/components/SessionProvider";
import { useSession } from "@/hooks/useSession";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminFinance } from "@/pages/AdminFinance";
import { AdminGrades } from "@/pages/AdminGrades";
import { AdminLeave } from "@/pages/AdminLeave";
import { AdminStudents } from "@/pages/AdminStudents";
import { AttendancePage } from "@/pages/AttendancePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { FinancePage } from "@/pages/FinancePage";
import { GradesPage } from "@/pages/GradesPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProfilePage } from "@/pages/ProfilePage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  beforeLoad: () => {
    const stored = localStorage.getItem("mi-nurul-falah.session");
    if (!stored) {
      throw redirect({ to: "/login" });
    }
    try {
      const parsed = JSON.parse(stored) as { token?: string; kind?: string };
      if (!parsed.token || !parsed.kind) {
        throw redirect({ to: "/login" });
      }
      return { sessionKind: parsed.kind };
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: DashboardPage,
});

const gradesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/nilai",
  component: GradesPage,
});

const attendanceRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/kehadiran",
  component: AttendancePage,
});

const financeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/keuangan",
  component: FinancePage,
});

const profileRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/profil",
  component: ProfilePage,
});

const adminRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin",
  beforeLoad: ({ context }) => {
    if (context.sessionKind !== "guru") {
      throw redirect({ to: "/" });
    }
  },
  component: AdminDashboard,
});

const adminStudentsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/siswa",
  beforeLoad: ({ context }) => {
    if (context.sessionKind !== "guru") {
      throw redirect({ to: "/" });
    }
  },
  component: AdminStudents,
});

const adminGradesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/mapel",
  beforeLoad: ({ context }) => {
    if (context.sessionKind !== "guru") {
      throw redirect({ to: "/" });
    }
  },
  component: AdminGrades,
});

const adminAttendanceRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/kehadiran",
  beforeLoad: ({ context }) => {
    if (context.sessionKind !== "guru") {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLeave,
});

const adminFinanceRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/keuangan",
  beforeLoad: ({ context }) => {
    if (context.sessionKind !== "guru") {
      throw redirect({ to: "/" });
    }
  },
  component: AdminFinance,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([
    dashboardRoute,
    gradesRoute,
    attendanceRoute,
    financeRoute,
    profileRoute,
    adminRoute,
    adminStudentsRoute,
    adminGradesRoute,
    adminAttendanceRoute,
    adminFinanceRoute,
  ]),
]);

const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  );
}
