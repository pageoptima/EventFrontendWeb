import { useSearchParams } from "react-router-dom";

// Keeps a tab selection in the `tab` URL search param instead of local
// state — local state resets to the default whenever the page remounts
// (e.g. navigating to a detail page and pressing back), while the URL
// survives that round-trip.
export function useTabSearchParam(defaultTab, validTabs) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = validTabs.includes(requestedTab) ? requestedTab : defaultTab;

  const setActiveTab = (key) => {
    const next = new URLSearchParams(searchParams);
    if (key === defaultTab) {
      next.delete("tab");
    } else {
      next.set("tab", key);
    }
    // Replace, not push — switching tabs shouldn't fill up browser history
    setSearchParams(next, { replace: true });
  };

  return [activeTab, setActiveTab];
}
