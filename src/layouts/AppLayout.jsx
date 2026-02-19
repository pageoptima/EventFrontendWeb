import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

function AppLayout() {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
