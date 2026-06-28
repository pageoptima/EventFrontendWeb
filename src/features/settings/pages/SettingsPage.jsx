import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { clearCredentials } from "@/stores/slices/authSlice";

function SettingsPage() {
  const dispatch = useDispatch();

  // ProtectedRoute detects isAuthenticated=false after dispatch and handles
  // the redirect to /auth/login — no need to navigate() here as well.
  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  return (
    <section className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-1">
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Account
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </section>
  );
}

export default SettingsPage;
