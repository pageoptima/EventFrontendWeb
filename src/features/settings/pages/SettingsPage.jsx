import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { User, Bookmark, Moon, BarChart2, Shield, LogOut } from "lucide-react";
import { clearCredentials, selectCurrentUser } from "@/stores/slices/authSlice";
import { useMyProfile } from "@/features/profile/hooks/useProfile";
import EditProfilePanel from "@/features/settings/components/EditProfilePanel";
import SavedEventsPanel from "@/features/settings/components/SavedEventsPanel";
import ThemePanel from "@/features/settings/components/ThemePanel";
import AnalyticsPanel from "@/features/settings/components/AnalyticsPanel";
import PrivacyPanel from "@/features/settings/components/PrivacyPanel";

const NAV_ITEMS = [
  { key: "profile",   label: "Edit Profile",  icon: User      },
  { key: "saved",     label: "Saved Events",   icon: Bookmark  },
  { key: "theme",     label: "Theme",          icon: Moon      },
  { key: "analytics", label: "Analytics",      icon: BarChart2 },
  { key: "privacy",   label: "Privacy",        icon: Shield    },
];

const PANELS = {
  profile:   EditProfilePanel,
  saved:     SavedEventsPanel,
  theme:     ThemePanel,
  analytics: AnalyticsPanel,
  privacy:   PrivacyPanel,
};

function SettingsPage() {
  const dispatch    = useDispatch();
  const queryClient = useQueryClient();
  const user        = useSelector(selectCurrentUser);
  const { data: profile } = useMyProfile();
  const [activeTab, setActiveTab] = useState("profile");

  const ActivePanel = PANELS[activeTab];

  const handleLogout = () => {
    dispatch(clearCredentials());
    queryClient.clear();
  };

  return (
    <div className="flex flex-col gap-6 md:grid md:grid-cols-[224px_1fr]">

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="w-full md:sticky md:top-6 md:self-start">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card md:h-[calc(100vh-3rem)]">

          {/* User identity */}
          <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-4">
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={user?.name}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                {user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Navigation — grows to fill remaining space */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5" aria-label="Settings navigation">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={[
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  activeTab === key
                    ? "bg-[#7F5AF0] font-semibold text-white"
                    : "font-medium text-foreground hover:bg-muted",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>

          {/* Log out — always at the bottom */}
          <div className="shrink-0 border-t border-border p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              Log out
            </button>
          </div>

        </div>
      </aside>

      {/* ── Content panel ────────────────────────────────────────────── */}
      <div className="min-w-0">
        <ActivePanel />
      </div>

    </div>
  );
}

export default SettingsPage;
