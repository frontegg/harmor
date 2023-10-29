import * as crypto from 'crypto';

export interface EncryptionOptions {
  /**
   * Whether to encrypt the sanitize content or remove them.
   */
  enabled: boolean;
  /**
   * The password to use for encryption.
   */
  password: string;
}

/**
 * Generate a random password
 * @param length The length of the password to generate
 * @returns A random password
 */
export const generateRandomPassword = (length = 20) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

const prefix = '__HARMORed__'

export const encrypt = (text: string, password: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([ encrypted, cipher.final() ]);
  const salt = iv.toString('hex')
  const encryptedText = encrypted.toString('hex')
  return `${prefix}${salt}__${encryptedText}`;
}


export const decrypt = (encrypted: string, password: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(password, 'salt', 32);
  const textParts = encrypted.substring(prefix.length).split('__');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join('__'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([ decrypted, decipher.final() ]);
  return decrypted.toString();
}
