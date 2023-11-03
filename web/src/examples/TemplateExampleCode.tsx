import { FC, useEffect } from 'react';

const TemplateExampleCode: FC = () => {


  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.hljs.highlightAll()
  }, []);
  return <>
    <pre style={{
      overflow: 'auto',
      borderRadius: '8px',
      maxHeight: '400px',
    }}><code className="hljs language-json" style={{ background: '#1a1a1a' }}>{JSON.stringify({
      'encryption': {
        'enabled': false
      },
      'jwt': true,
      'allCookies': false,
      'cookies': [
        'fe_session_',
        'fe_refresh_',
        'fe_device_',
        'fe_webauthn_',
        'sessionid',
        'JSESSIONID',
        'PHPSESSID',
        'csrftoken',
        'auth_token'
      ],
      'allHeaders': false,
      'headers': [
        'authorization',
        'x-frontegg-',
        'client-id',
        'tenant-id',
        'x-client-data'
      ],
      'allQueryParams': false,
      'queryParams': [
        'code',
        'SAMLRequest',
        'SAMLResponse',
        'token',
        'code_challenge',
        'code_verifier'
      ],
      'urlPathPrefixes': [
        '/vendors/api-key'
      ],
      'contentKeys': [
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
        'token'
      ]
    }, null, 2)}</code></pre>

  </>
}


export default TemplateExampleCode
