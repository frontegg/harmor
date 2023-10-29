#!/usr/bin/env node

import * as process from 'process';
import * as minimist from 'minimist'
import * as prompts from 'prompts';
import { isUsingYarn } from './helpers';
import { HARmorRule } from './types';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { lightCyan, red, reset } from 'kolorist';
import { printLogo } from './logo';
import { encrypt, EncryptionOptions } from './crypto';
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
  pass?: string
  allCookies?: boolean
  cookie?: string;
  allHeaders?: boolean
  header?: string;
}>(process.argv.slice(2), {
  string: [ '_' ],
})

const cwd = process.cwd()

async function init() {
  const argTemplate = argv.template || argv.t
  const argPassword = argv.pass
  const argAllCookies = argv.allCookies
  const argCookie = argv.cookie
  const argAllHeaders = argv.allHeaders
  const argHeader = argv.header


  const isYarn = isUsingYarn()

  console.log({ argv, isYarn })

  let result: prompts.Answers<'template' | 'password'>
  try {
    result = await prompts([ {
        type: argTemplate ? null : 'text',
        name: 'template',
        message: reset('Template:'),
        initial: 'default',
        validate: (prev) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 1000)
          })

        },
      }, {
        type: argPassword ? null : 'password',
        name: 'password',
        message: reset('Encryption Password:') + lightCyan(' (leave empty for no encryption)'),
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

  const rules: HARmorRule[] = [ {
    action: 'replace',
    selector: /eyJ[a-zA-Z0-9-_]+\.eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\b/g,
    replacement: (value) => {
      const alg = encrypt(value.split('.')[0], 'davidantoon')
      const payload = value.split('.')[1];
      const signature = encrypt(value.split('.')[2], 'davidantoon')
      return `${alg}.${payload}.${signature}`
    },
  } ]

  const input = fs.readFileSync(filePath, 'utf8');


  const encryption: EncryptionOptions = {
    enabled: !!result.password,
    password: result.password === true ? '' : result.password
  }

  const harmor = Harmor.builder().jwt().build()


  // const output = await Ha({ input, encryption, rules })

  const output = ''
  fs.writeFileSync(path.join(dirname, `${fileName}.harmored.har`), output, 'utf8')
}

printLogo()
init().catch((err) => {
  console.error(err);
})



