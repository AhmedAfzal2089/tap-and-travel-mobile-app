export function getTimeDifference(departureTime, arrivalTime) {
  const [depHours, depMinutes] = departureTime.split(":").map(Number);
  const [arrHours, arrMinutes] = arrivalTime.split(":").map(Number);

  // Create Date objects (assuming same day)
  const depDate = new Date(0, 0, 0, depHours, depMinutes);
  const arrDate = new Date(0, 0, 0, arrHours, arrMinutes);

  // If arrival is earlier than departure (next day), add 1 day
  if (arrDate < depDate) {
    arrDate.setDate(arrDate.getDate() + 1);
  }

  const diffMs = arrDate - depDate;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHours}h ${diffMinutes}m`;
}
