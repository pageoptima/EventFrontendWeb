import { useDispatch, useSelector } from "react-redux";
import { Moon, Sun } from "lucide-react";
import { toggleTheme, selectThemeMode } from "@/stores/slices/themeSlice";

function ThemePanel() {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Theme</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Choose how Event looks for you.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            )}
            <div>
              <p className="text-sm font-medium text-foreground">Dark mode</p>
              <p className="text-xs text-muted-foreground">
                {isDark ? "Currently using dark theme" : "Currently using light theme"}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={() => dispatch(toggleTheme())}
            className={[
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isDark ? "bg-[#7F5AF0]" : "bg-border",
            ].join(" ")}
          >
            <span
              className={[
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                isDark ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemePanel;
