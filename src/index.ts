#!/usr/bin/env node

import * as process from 'process';
import * as minimist from 'minimist'
import * as prompts from 'prompts';
import { isUsingYarn } from './helpers';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { green, red, reset, bgRed, bgYellow, yellow } from 'kolorist';
import { printLogo } from './logo';
import Harmor from './Harmor';


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
  t?: string
  template?: string
  allCookies?: boolean
  cookie?: string;
  allHeaders?: boolean
  header?: string;
  jwt?: string;
  pass?: string
  enc?: string;
  y: boolean;
}>(process.argv.slice(2), {
  string: [ '_' ],
})

const cwd = process.cwd()

async function init() {
  const argTemplate = argv.template || argv.t
  const argEncryption = argv.enc
  const argPassword = argv.pass
  const argAllCookies = argv.allCookies
  const argCookie = argv.cookie
  const argAllHeaders = argv.allHeaders
  const argHeader = argv.header
  const argJwt = argv.jwt ?? true
  const argYesForAll = argv.y ?? false

  const isYarn = isUsingYarn()

  let result: prompts.Answers<'encryption'>
  try {
    result = await prompts([ {
        type: argEncryption ? null : 'confirm',
        name: 'encryption',
        message: reset('Enable encryption'),
        initial: true
      } ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        },
      },
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  const filePath = '/Users/davidfrontegg/git/harmor/src/data/test1.har'
  const dirname = path.dirname(filePath)
  const fileName = path.basename(filePath, '.har')

  const input = fs.readFileSync(filePath, 'utf8');

  const harmorBuilder = Harmor.Builder()

  if (result.encryption) {
    harmorBuilder.encryption(argPassword)
  }
  if (argAllCookies) {
    harmorBuilder.allCookies()
  }
  if (argCookie) {
    if (Array.isArray(argCookie)) {
      argCookie.forEach(cookie => harmorBuilder.cookie(cookie))
    } else {
      harmorBuilder.cookie(argCookie)
    }
  }
  if (argAllHeaders) {
    harmorBuilder.allHeaders()
  }
  if (argHeader) {
    if (Array.isArray(argHeader)) {
      argHeader.forEach(header => harmorBuilder.header(header))
    } else {
      harmorBuilder.header(argHeader)
    }
  }

  if (argJwt) {
    harmorBuilder.jwt()
  }

  const harmor = harmorBuilder.build()
  const output = harmor.sanitize(input)

  console.log('\n')
  fs.writeFileSync(path.join(dirname, `${fileName}.harmored.har`), output, 'utf8')
  console.log('🛡 HAR been armored:', green(path.join(cwd, `${fileName}.harmor.har`)))

  if (result.encryption) {
    console.log('🔑 Encryption password:', bgRed(harmor.encryption.password))
    console.log('⚠️', yellow(`Please keep this password safe, you will need it to unarmor the HAR file.`))
  }
}

printLogo()
init().catch((err) => {
  console.error(err);
})

