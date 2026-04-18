import { getAuthorizationHeader } from '@/utils/auth';

describe('getAuthorizationHeader', () => {
  it('adds the bearer prefix to raw tokens', () => {
    expect(getAuthorizationHeader('abc123')).toBe('Bearer abc123');
  });

  it('preserves tokens that already include the bearer prefix', () => {
    expect(getAuthorizationHeader('Bearer abc123')).toBe('Bearer abc123');
  });
});
