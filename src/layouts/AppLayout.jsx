import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

function AppLayout() {
  return (
    <div className="min-h-screen text-foreground bg-fixed bg-[linear-gradient(135deg,#F1E7FB_0%,#FFFFFF_75%)]">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
