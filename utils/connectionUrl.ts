type ConnectionProtocol = 'http' | 'https' | 'ws' | 'wss';
type ConnectionProtocolFamily = 'http' | 'ws';
const DEFAULT_CONNECTION_PORT = '26538';

const IPV4_ADDRESS_REGEX =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

const isPrivateIpv4 = (host: string) => {
  if (!IPV4_ADDRESS_REGEX.test(host)) return false;

  const [firstSegment, secondSegment] = host
    .split('.')
    .map((segment) => Number(segment));

  return (
    firstSegment === 10 ||
    firstSegment === 127 ||
    firstSegment === 0 ||
    (firstSegment === 169 && secondSegment === 254) ||
    (firstSegment === 172 && secondSegment >= 16 && secondSegment <= 31) ||
    (firstSegment === 192 && secondSegment === 168)
  );
};

export const isLocalConnectionHost = (host: string) => {
  const normalizedHost = host.trim().toLowerCase();

  if (!normalizedHost) return true;

  return (
    normalizedHost === 'localhost' ||
    normalizedHost.endsWith('.local') ||
    !normalizedHost.includes('.') ||
    isPrivateIpv4(normalizedHost)
  );
};

export const getConnectionProtocol = (
  host: string,
  protocolFamily: ConnectionProtocolFamily = 'http'
): ConnectionProtocol => {
  const isLocalHost = isLocalConnectionHost(host);

  if (protocolFamily === 'ws') return isLocalHost ? 'ws' : 'wss';

  return isLocalHost ? 'http' : 'https';
};

const getConnectionPort = (host: string, port: string) => {
  const normalizedPort = port.trim();

  if (isLocalConnectionHost(host))
    return normalizedPort || DEFAULT_CONNECTION_PORT;

  if (
    !normalizedPort ||
    normalizedPort === DEFAULT_CONNECTION_PORT ||
    normalizedPort === '443'
  )
    return '';

  return normalizedPort;
};

export const getConnectionOrigin = ({
  host,
  port,
  protocolFamily = 'http',
}: {
  host: string;
  port: string;
  protocolFamily?: ConnectionProtocolFamily;
}) => {
  const normalizedHost = host.trim() || '0.0.0.0';
  const protocol = getConnectionProtocol(normalizedHost, protocolFamily);
  const resolvedPort = getConnectionPort(normalizedHost, port);

  return `${protocol}://${normalizedHost}${resolvedPort ? `:${resolvedPort}` : ''}`;
};
