import * as prompts from 'prompts';
import { gray } from 'kolorist';
import Crypto, { EncryptionOptions } from '../crypto';
import { promptOptions } from './constants';

type GeneralQuestionerResult = {
  encryption: EncryptionOptions;
  jwt: boolean;
}

const generalQuestioner = async (): Promise<GeneralQuestionerResult> => {
  console.log('');


  const encryption: EncryptionOptions = {
    enabled: true,
  }

  const { encryptionEnabled } = await prompts({
    type: 'select',
    name: 'encryptionEnabled',
    message: 'How do you want to sanitize values?',
    instructions: false,
    choices: [ {
      title: 'by Encryption',
      value: true,
      selected: true
    }, {
      title: 'by replace with \'_harmored_\'',
      value: false
    } ],
  }, promptOptions)
  encryption.enabled = encryptionEnabled;

  if (encryptionEnabled) {
    const { encryptionPassword } = await prompts({
      type: 'text',
      name: 'encryptionPassword',
      message: 'Enter encryption password' + gray(' - press enter to use the generated password'),
      initial: Crypto.generateRandomPassword(),
      validate: (value) => {
        if (value.length < 16) {
          return 'Password must be at least 16 characters long'
        }
        return true
      }
    }, promptOptions)

    encryption.password = encryptionPassword
  }

  const { jwt } = await prompts({
    type: 'confirm',
    name: 'jwt',
    message: 'Do you want to sanitize all JWT by regex?' + gray(' - algorithm and signature will be sanitized'),
    instructions: false,
    initial: true
  }, promptOptions)
  return {
    encryption,
    jwt
  }

}
export default generalQuestioner
