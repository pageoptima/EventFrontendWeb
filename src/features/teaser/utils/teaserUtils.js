export function formatTeaserDateLabel(value) {
  if (!value) return "date-tbd";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "date-tbd";

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
