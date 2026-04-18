import {
  getConnectionOrigin,
  getConnectionProtocol,
  isLocalConnectionHost,
} from '@/utils/connectionUrl';

describe('connectionUrl helpers', () => {
  describe('isLocalConnectionHost', () => {
    it('treats localhost-like targets as local', () => {
      expect(isLocalConnectionHost('localhost')).toBe(true);
      expect(isLocalConnectionHost('musicbox')).toBe(true);
      expect(isLocalConnectionHost('speaker.local')).toBe(true);
      expect(isLocalConnectionHost('192.168.1.25')).toBe(true);
    });

    it('treats public hostnames as remote', () => {
      expect(isLocalConnectionHost('example.com')).toBe(false);
      expect(isLocalConnectionHost('remote.example.net')).toBe(false);
      expect(isLocalConnectionHost('8.8.8.8')).toBe(false);
    });
  });

  describe('getConnectionProtocol', () => {
    it('uses insecure protocols for local targets', () => {
      expect(getConnectionProtocol('musicbox')).toBe('http');
      expect(getConnectionProtocol('musicbox', 'ws')).toBe('ws');
    });

    it('uses secure protocols for public targets', () => {
      expect(getConnectionProtocol('example.com')).toBe('https');
      expect(getConnectionProtocol('example.com', 'ws')).toBe('wss');
    });
  });

  describe('getConnectionOrigin', () => {
    it('keeps the default local port for local targets', () => {
      expect(getConnectionOrigin({ host: 'localhost', port: '' })).toBe(
        'http://localhost:26538'
      );
    });

    it('omits default-like ports for remote targets', () => {
      expect(getConnectionOrigin({ host: 'example.com', port: '' })).toBe(
        'https://example.com'
      );
      expect(getConnectionOrigin({ host: 'example.com', port: '443' })).toBe(
        'https://example.com'
      );
      expect(getConnectionOrigin({ host: 'example.com', port: '26538' })).toBe(
        'https://example.com'
      );
    });

    it('keeps custom ports for remote targets', () => {
      expect(getConnectionOrigin({ host: 'example.com', port: '8443' })).toBe(
        'https://example.com:8443'
      );
    });

    it('falls back to 0.0.0.0 when the host is blank', () => {
      expect(getConnectionOrigin({ host: '   ', port: '' })).toBe(
        'http://0.0.0.0:26538'
      );
    });
  });
});
