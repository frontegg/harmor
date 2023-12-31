#!/usr/bin/env node

import * as process from 'process';
import * as minimist from 'minimist'
import * as fs from 'node:fs';
import * as path from 'node:path';
import { green, bgRed, yellow, red } from 'kolorist';
import Harmor from './Harmor';
import questioner from './questioner';
import * as prompts from 'prompts';
import { promptOptions } from './questioner/constants';
import templates from './templates';
import { HARmorTemplate } from './templates/types';

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
  template?: string;
  h?: boolean;
  help?: boolean;
}>(process.argv.slice(2), {
  string: [ '_' ],
})


function showUsage() {
  console.log(`

  Usage: npx harmor <path_to_file>

  Description:
      HARmor is a tool designed to sanitize HAR files.

  Options:
      --template=<path_to_template>    The path to a JSON file containing the template to use for sanitization.

  Arguments:
      <path_to_file>                   The path to the HAR file you want to sanitize.

  Examples:
      npx harmor ./data/domain.com.har 
      npx harmor --template=./my-template.json ./domain.com.har 

  For more information, visit https://harmor.dev.
  
`);
}

async function init() {
  const argTemplate = argv.template
  const showHelp = argv.help ?? argv.h
  const fileRelativePath = argv._


  if (showHelp) {
    showUsage()
    process.exit(1)
  }

  if (fileRelativePath.length === 0) {
    showUsage()
    console.log(red('Error: No file specified.'));
    process.exit(1)
  }

  const filePath = path.join(process.cwd(), fileRelativePath[0]);

  if (!fs.existsSync(filePath)) {
    showUsage()
    console.log(red(`Error: File "${filePath}" does not exist.`));
    process.exit(1);
  }


  const dirname = path.dirname(filePath)
  const fileName = path.basename(filePath, '.har')

  const input = fs.readFileSync(filePath, 'utf8');
  const harFile = JSON.parse(input);


  let template: HARmorTemplate
  if (argTemplate) {
    const templateFilePath = path.join(process.cwd(), argTemplate);

    if (templates[argTemplate]) {
      template = templates[argTemplate];
    }
    if (!fs.existsSync(templateFilePath)) {
      showUsage()
      console.log(red(`Error: Template file "${templateFilePath}" does not exist.`));
      process.exit(1);
    }
    try {
      template = JSON.parse(fs.readFileSync(templateFilePath, 'utf8'));
    } catch (err) {
      showUsage()
      console.log(red(`Error: Template file "${templateFilePath}" is not a valid JSON file.`));
      process.exit(1);
    }
  } else {
    const result = await questioner(harFile)
    template = { type: 'basic', ...result }
    const { confirm, templateName } = await prompts([ {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to save this template for future use?',
      initial: true
    }, {
      type: (_, values) => values.confirm ? 'text' : null,
      name: 'templateName',
      message: 'Enter template name:',
    } ], promptOptions)

    if (confirm) {
      let name = templateName || 'harmor.template.json'
      name = name.endsWith('.json') ? name : `${name}.json`
      fs.writeFileSync(path.join(dirname, name), JSON.stringify(result), 'utf8')
    }
  }

  const harmor = Harmor.Builder().fromTemplate(template)

  const output = harmor.sanitize(input)

  console.log('\n')
  fs.writeFileSync(path.join(dirname, `${fileName}.harmored.har`), output, 'utf8')
  console.log('🛡 HAR been armored:', green(path.join(dirname, `${fileName}.harmor.har`)))

  if (harmor.encryption.enabled) {
    console.log('🔑 Encryption password:', bgRed(harmor.encryption.password))
    console.log('⚠️', yellow(`Please keep this password safe, you will need it to unarmor the HAR file.`))
  }
}

init().catch((err) => {
  console.error(err);
})

