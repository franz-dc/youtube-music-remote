import {
  isWithinSeekTolerance,
  shouldIgnoreSeekPositionUpdate,
} from '@/utils/seek';

describe('seek helpers', () => {
  describe('isWithinSeekTolerance', () => {
    it('treats values within one second as equivalent', () => {
      expect(isWithinSeekTolerance(10, 10)).toBe(true);
      expect(isWithinSeekTolerance(10, 11)).toBe(true);
      expect(isWithinSeekTolerance(10, 9)).toBe(true);
    });

    it('treats larger jumps as meaningfully different', () => {
      expect(isWithinSeekTolerance(10, 12)).toBe(false);
    });
  });

  describe('shouldIgnoreSeekPositionUpdate', () => {
    it('ignores stale realtime positions while a local seek is still in flight', () => {
      expect(
        shouldIgnoreSeekPositionUpdate({
          position: 15,
          pendingSeekSeconds: 30,
          seekInFlightUntil: 5_000,
          now: 4_000,
        })
      ).toBe(true);
    });

    it('accepts positions once the server catches up', () => {
      expect(
        shouldIgnoreSeekPositionUpdate({
          position: 29,
          pendingSeekSeconds: 30,
          seekInFlightUntil: 5_000,
          now: 4_000,
        })
      ).toBe(false);
    });

    it('accepts positions after the grace window expires', () => {
      expect(
        shouldIgnoreSeekPositionUpdate({
          position: 15,
          pendingSeekSeconds: 30,
          seekInFlightUntil: 5_000,
          now: 5_000,
        })
      ).toBe(false);
    });

    it('accepts positions when there is no pending local seek', () => {
      expect(
        shouldIgnoreSeekPositionUpdate({
          position: 15,
          pendingSeekSeconds: null,
          seekInFlightUntil: 5_000,
          now: 4_000,
        })
      ).toBe(false);
    });
  });
});
