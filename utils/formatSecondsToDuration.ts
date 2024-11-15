/**
 * Format seconds to a duration string in the format of `H:MM:SS`.
 * @param seconds The number of seconds to convert.
 */
export const formatSecondsToDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return hours > 0
    ? `${hours}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    : `${remainingMinutes}:${String(remainingSeconds).padStart(2, '0')}`;
};
