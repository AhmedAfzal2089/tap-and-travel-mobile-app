export function extractSeatNumber(seatString) {
  const parts = seatString.split("-");
  return parts[1];
}
