import { Outlet } from "react-router-dom";
import { NotificationsLayer } from "@/features/notifications";
import AppSidebar from "@/app/layouts/AppSidebar";
import BottomNav from "@/app/layouts/BottomNav";

function AppLayout() {
  return (
    <div className="min-h-screen text-foreground bg-fixed bg-[linear-gradient(135deg,#F1E7FB_0%,#FFFFFF_75%)] dark:bg-none dark:bg-background">
      <AppSidebar />
      {/*
        Mobile  (< md):  no sidebar   → full width,  p-4, pb-20 for bottom nav
        Tablet  (md–lg): icon sidebar → ml-16, p-6,  no bottom nav
        Desktop (lg+):   full sidebar → ml-64, p-6,  no bottom nav
      */}
      <main className="min-h-screen p-4 pb-20 md:ml-16 md:p-6 md:pb-6 lg:ml-64">
        <Outlet />
      </main>
      <BottomNav />
      <NotificationsLayer />
    </div>
  );
}

export default AppLayout;
