import { QuestionerResult } from '../questioner/types';

export default {
  encryption: { enabled: false },
  headers: [
    'authorization',
    'x-frontegg-',
    'client-id',
    'tenant-id',
  ],
  cookies: [
    'fe_session',
    'fe_refresh',
    'fe_device',
    'fe_client_id',
    'fe_webauthn',
    'fe_tenant',
    'fe_oauth_flows_session',
    'fe_user_access_token',
    'fe_tenant_access_token',
    'fe_magic_link',
    'fe_otc_'
  ],
  contentKeys: [
    'refreshToken',
    'refresh_token',
    'accessToken',
    'access_token',
    'code_challenge',
    'client_id',
    'client_secret',
    'code',
    'secret',
    'code_verifier',
    'mfaToken',
  ],
  queryParams: [
    'code',
    'SAMLRequest',
    'SAMLResponse',
    'token',
    'code_challenge',
    'code_verifier',
  ],
  jwt: true,
  urlPathPrefixes: [
    '/vendors/api-key',
    '/frontegg/identity/resources/users/api-tokens',
    '/frontegg/identity/resources/tenants/api-tokens',
    '/frontegg/identity/resources/users/v1/mfa/enroll'
  ]


} as QuestionerResult;
