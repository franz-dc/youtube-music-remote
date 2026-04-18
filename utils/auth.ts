export const getAuthorizationHeader = (accessToken: string) =>
  accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
