export function getCountdownLabel(startDateTime) {
  const start = new Date(startDateTime);
  if (Number.isNaN(start.getTime())) return "Date TBD";
  const diffMs = start.getTime() - Date.now();
  if (diffMs <= 0) return "Now";
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d : ${hours}h : ${minutes}m`;
}

export function getEventDateLabel(startDateTime) {
  const date = new Date(startDateTime);
  if (Number.isNaN(date.getTime())) return { day: "--", month: "---" };
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  return { day, month };
}
