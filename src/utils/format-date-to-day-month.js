export function formatDateToDayMonth(date) {
  // Convert input to a Date object if it's a string
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj)) {
    throw new Error("Invalid date provided");
  }

  // Extract the day and month
  const day = dateObj.getDate();
  const monthShort = dateObj.toLocaleString("en-US", { month: "short" });

  // Determine ordinal suffix for the day
  const suffix = ["th", "st", "nd", "rd"];
  const value = day % 100;
  const ordinal = suffix[(value - 20) % 10] || suffix[value] || suffix[0];

  // Return formatted string
  return `${day}${ordinal} ${monthShort}`;
}
