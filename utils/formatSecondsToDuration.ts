/**
 * Format seconds to a duration string in the format of `MM:SS`.
 * @param seconds The number of seconds to convert.
 */
export const formatSecondsToDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
