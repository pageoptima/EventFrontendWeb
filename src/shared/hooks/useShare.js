import { useCallback, useRef, useState } from "react";

const COPIED_RESET_DELAY = 2000;

// navigator.share opens the OS/browser share sheet (Instagram-style). When it's
// unavailable or fails for a reason other than the user cancelling, we fall back
// to copying the link, with `copied` flipping true briefly to confirm it.
export function useShare() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(null);

  const share = useCallback(async ({ title, text, url }) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
        // fall through to clipboard fallback
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_DELAY);
    } catch {
      // clipboard unavailable (permissions/insecure context) — nothing more to do
    }
  }, []);

  return { share, copied };
}
