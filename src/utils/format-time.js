export function formatTime(inputTime) {
  // If input is in "HH:mm" string format
  if (typeof inputTime === "string" && /^\d{2}:\d{2}$/.test(inputTime)) {
    const [hours, minutes] = inputTime.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  // For other formats (e.g., ISO string, timestamp)
  const date = new Date(inputTime);
  if (isNaN(date)) {
    throw new Error("Invalid input time format.");
  }

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}
