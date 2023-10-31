#!/usr/bin/env node

import * as process from 'process';
import * as minimist from 'minimist'
import { isUsingYarn } from './helpers';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { green, bgRed, yellow } from 'kolorist';
import Harmor from './Harmor';
import questioner from './questioner';


const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = Number(semver[0]);

if (major < 16) {
  console.error(
    `You are running Node ${currentNodeVersion}.\n` +
    'HARmer requires Node 16 or higher. Please update your version of Node.'
  );
  process.exit(1);
}


const argv = minimist<{
  template?: string
  allCookies?: boolean
  cookie?: string;
  allHeaders?: boolean
  header?: string;
  jwt?: boolean;
  authorization?: boolean;
  contentKey?: string;
  urlPathPrefix?: string;
  pass?: string
  enc?: boolean;
  y: boolean;
}>(process.argv.slice(2), {
  string: [ '_' ],
})

const cwd = process.cwd()

async function init() {
  const argTemplate = argv.template
  const argEncryption = argv.enc !== undefined
  const argPassword = argv.pass
  const argAllCookies = argv.allCookies
  const argCookie = argv.cookie
  const argAllHeaders = argv.allHeaders
  const argHeader = argv.header
  const argJwt = argv.jwt
  const argAuthorization = argv.authorization
  const argContentKey = argv.contentKey
  const argUrlPathPrefix = argv.urlPathPrefix
  const argQueryParam = argv.queryParam
  const argYesForAll = argv.y ?? false

  const isYarn = isUsingYarn()


  const filePath = '/Users/davidfrontegg/git/harmor/src/data/test1.har'
  const dirname = path.dirname(filePath)
  const fileName = path.basename(filePath, '.har')

  const input = fs.readFileSync(filePath, 'utf8');
  const harFile = JSON.parse(input);

  const result = await questioner(harFile)

  const harmorBuilder = Harmor.Builder()

  if (result.encryption ?? argEncryption) {
    harmorBuilder.encryption(argPassword)
  }
  if (result.allCookies) {
    harmorBuilder.allCookies()
  }

  if (result.cookies.length > 0) {
    result.cookies.forEach(cookie => harmorBuilder.cookie(cookie))
  }

  if (result.allHeaders) {
    harmorBuilder.allHeaders()
  }

  if (result.headers.length > 0) {
    result.headers.forEach(header => harmorBuilder.header(header))
  }


  if (result.allQueryParams) {
    harmorBuilder.allQueryParams()
  }

  if (result.queryParams.length > 0) {
    result.queryParams.forEach(header => harmorBuilder.header(header))
  }

  if (result.jwt) {
    harmorBuilder.jwt()
  }

  if (result.authorization) {
    harmorBuilder.authorization()
  }

  if (argContentKey) {
    harmorBuilder.contentKey(typeof argContentKey === 'string' ? [ argContentKey ] : argContentKey)
  }

  if (argUrlPathPrefix) {
    const urlPathPrefixs = Array.isArray(argUrlPathPrefix) ? argUrlPathPrefix : [ argUrlPathPrefix ]
    harmorBuilder.byUrlPath(urlPathPrefixs)
  }

  if (argQueryParam) {
    const queryParams = Array.isArray(argQueryParam) ? argQueryParam : [ argQueryParam ]
    harmorBuilder.queryParam(queryParams)
  }


  const harmor = harmorBuilder.build()
  const output = harmor.sanitize(input)


  console.log('\n')
  fs.writeFileSync(path.join(dirname, `${fileName}.harmored.har`), output, 'utf8')
  console.log('🛡 HAR been armored:', green(path.join(cwd, `${fileName}.harmor.har`)))

  if (harmor.encryption.enabled) {
    console.log('🔑 Encryption password:', bgRed(harmor.encryption.password))
    console.log('⚠️', yellow(`Please keep this password safe, you will need it to unarmor the HAR file.`))
  }
}

init().catch((err) => {
  console.error(err);
})

