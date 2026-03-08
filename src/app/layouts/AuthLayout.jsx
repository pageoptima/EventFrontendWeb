import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
        <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h1 className="text-xl font-semibold">Event</h1>
            <p className="text-sm text-muted-foreground">Sign in to continue</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
