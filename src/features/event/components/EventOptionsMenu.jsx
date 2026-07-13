import { useState } from "react";
import { MoreHorizontal, Globe, Users, Lock, Loader2 } from "lucide-react";
import { useDeleteEvent, useChangeEventVisibility } from "@/features/event/hooks/useEvent";

const VISIBILITY_OPTIONS = [
  {
    value: "PUBLIC",
    label: "Public",
    description: "Anyone can see this event",
    Icon: Globe,
  },
  {
    value: "FRIENDS",
    label: "Friends",
    description: "Only your friends can see this event",
    Icon: Users,
  },
  {
    value: "PRIVATE",
    label: "Private",
    description: "Only you can see this event",
    Icon: Lock,
  },
];

function Overlay({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-t-2xl bg-card sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function MenuView({ currentVisibility, onVisibility, onDelete, onClose }) {
  const visLabel = VISIBILITY_OPTIONS.find((o) => o.value === currentVisibility)?.label ?? "Public";

  return (
    <>
      <div className="border-b border-border px-4 py-3 text-center">
        <p className="text-sm font-semibold text-foreground">Event options</p>
      </div>
      <button
        type="button"
        onClick={onVisibility}
        className="flex w-full items-center justify-between border-b border-border px-4 py-4 text-sm text-foreground hover:bg-muted/60"
      >
        <span>Visibility</span>
        <span className="text-xs text-muted-foreground">{visLabel}</span>
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-full border-b border-border px-4 py-4 text-sm font-medium text-destructive hover:bg-muted/60"
      >
        Delete event
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full px-4 py-4 text-sm text-muted-foreground hover:bg-muted/60"
      >
        Cancel
      </button>
    </>
  );
}

function VisibilityView({ currentVisibility, eventId, onBack, onClose }) {
  const [selected, setSelected] = useState(currentVisibility ?? "PUBLIC");
  const { mutate, isPending } = useChangeEventVisibility(eventId);

  function handleSave() {
    if (selected === currentVisibility) {
      onClose();
      return;
    }
    mutate(selected, { onSuccess: onClose });
  }

  return (
    <>
      <div className="flex items-center border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back
        </button>
        <p className="flex-1 text-center text-sm font-semibold text-foreground">Visibility</p>
        <div className="w-10" />
      </div>

      <div className="py-2">
        {VISIBILITY_OPTIONS.map(({ value, label, description, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelected(value)}
            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-muted/60"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4 text-foreground" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div
              className={`h-4 w-4 shrink-0 rounded-full border-2 transition ${
                selected === value
                  ? "border-brand-gradient-h bg-brand-gradient-h"
                  : "border-border"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="flex gap-3 border-t border-border px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted/60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-gradient-h py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </button>
      </div>
    </>
  );
}

function DeleteConfirmView({ eventId, onBack, onClose }) {
  const { mutate, isPending } = useDeleteEvent(eventId);

  return (
    <>
      <div className="border-b border-border px-4 py-3 text-center">
        <p className="text-sm font-semibold text-foreground">Delete event?</p>
      </div>
      <div className="px-4 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          This will permanently delete your event. This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-3 border-t border-border px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => mutate(undefined, { onError: onClose })}
          disabled={isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Delete
        </button>
      </div>
    </>
  );
}

function EventOptionsMenu({ eventId, currentVisibility }) {
  const [view, setView] = useState(null); // null | "menu" | "visibility" | "delete"

  if (!view) {
    return (
      <button
        type="button"
        onClick={() => setView("menu")}
        className="ml-auto rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Event options"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setView("menu")}
        className="ml-auto rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Event options"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      <Overlay onClose={() => setView(null)}>
        {view === "menu" && (
          <MenuView
            currentVisibility={currentVisibility}
            onVisibility={() => setView("visibility")}
            onDelete={() => setView("delete")}
            onClose={() => setView(null)}
          />
        )}
        {view === "visibility" && (
          <VisibilityView
            currentVisibility={currentVisibility}
            eventId={eventId}
            onBack={() => setView("menu")}
            onClose={() => setView(null)}
          />
        )}
        {view === "delete" && (
          <DeleteConfirmView
            eventId={eventId}
            onBack={() => setView("menu")}
            onClose={() => setView(null)}
          />
        )}
      </Overlay>
    </>
  );
}

export default EventOptionsMenu;
