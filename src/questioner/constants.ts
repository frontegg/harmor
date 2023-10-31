import { Options } from 'prompts';
import { red } from 'kolorist';

export const commonSensitiveCookies = [
  'fe_session', // Used by Frontegg to store stateless session in NextJS SDK.
  'fe_refresh_', // Used by Frontegg to store refresh token.
  'fe_device_',  // Used by Frontegg to store registered device token.
  'fe_webauthn_', // Used by Frontegg to store webauthn token.
  'sessionid', // Used by Frontegg to store temporary OTC token.
  'JSESSIONID', // Commonly used by many frameworks to store a unique session identifier.
  'PHPSESSID', // Used by ASP.NET applications.
  'csrftoken', // Used by PHP applications for session management.
  'auth_token', // Used to store CSRF protection tokens.
].map(cookie => cookie.replace('.', '\\.'))


export const commonSensitiveHeaders = [
  'authorization', // Used to store authentication tokens.
  'x-frontegg-', // Used by Frontegg to trace id and other parameters
  'client-id',
  'tenant-id',
  'x-client-data',
]

export const commonQueryParams = [
  'code', // Used by OAuth2 to store authorization codes.
  'SAMLRequest', // Used by SAML to store authorization codes.
  'SAMLResponse', // Used by SAML to store authorization codes.
  'token', // Used by OAuth2 to store access tokens.
  'code_challenge', // Used by OAuth2 to store authorization codes.
  'code_verifier', // Used by OAuth2 to store authorization codes.
]
export const commonJsonRestrictedKeys = [
  'refreshToken',
  'refresh_token',
  'accessToken',
  'access_token',
  'code_challenge',
  'client_id',
  'client_secret',
  'code',
  'code_challenge',
  'code_verifier',
  'id_token',
  'password',
  'token',
]


export const promptOptions: Options = {
  onCancel: () => {
    throw new Error(red('✖') + ' Operation cancelled')
  }
}
