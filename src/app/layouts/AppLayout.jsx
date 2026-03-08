import { Outlet } from "react-router-dom";
import { NotificationsLayer } from "@/features/notifications";
import AppSidebar from "@/app/layouts/AppSidebar";

function AppLayout() {
  return (
    <div className="min-h-screen text-foreground bg-fixed bg-[linear-gradient(135deg,#F1E7FB_0%,#FFFFFF_75%)]">
      <AppSidebar />
      <main className="flex-1 p-6 ml-64">
        <Outlet />
      </main>
      <NotificationsLayer />
    </div>
  );
}

export default AppLayout;
