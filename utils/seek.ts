const DEFAULT_SEEK_TOLERANCE_SECONDS = 1;

export const isWithinSeekTolerance = (
  currentSeconds: number,
  nextSeconds: number,
  toleranceSeconds = DEFAULT_SEEK_TOLERANCE_SECONDS
) => Math.abs(currentSeconds - nextSeconds) <= toleranceSeconds;

export const shouldIgnoreSeekPositionUpdate = ({
  position,
  pendingSeekSeconds,
  seekInFlightUntil,
  now = Date.now(),
  toleranceSeconds = DEFAULT_SEEK_TOLERANCE_SECONDS,
}: {
  position: number;
  pendingSeekSeconds: number | null;
  seekInFlightUntil: number;
  now?: number;
  toleranceSeconds?: number;
}) =>
  seekInFlightUntil > now &&
  pendingSeekSeconds !== null &&
  !isWithinSeekTolerance(position, pendingSeekSeconds, toleranceSeconds);
