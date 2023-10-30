import * as crypto from 'crypto';

export interface EncryptionOptions {
  /**
   * Whether to encrypt the sanitize content or remove them.
   */
  enabled: boolean;
  /**
   * The password to use for encryption.
   * If not provided, a random password will be generated.
   */
  password?: string;
}


/**
 * Generate a strong random password
 * @param {number} length - Length of the password
 * @param {boolean} includeSymbols - Whether to include special symbols in the password
 * @returns {string} - Generated password
 */
const generateRandomPassword = (length = 24, includeSymbols = true) => {
  const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*_-+=<>?';

  const charset = alpha + numbers + (includeSymbols ? symbols : '');
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomByte = crypto.randomBytes(1)[0];
    password += charset[randomByte % charset.length];
  }

  return password;
};

/**
 * Generate a random password
 * @param length The length of the password to generate
 * @returns A random password
 */
const generateEntityName = (length = 64) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return `[harmored_${retVal}]`;
}


const encrypt = (text: string, password: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([ encrypted, cipher.final() ]);
  const salt = iv.toString('hex')
  const encryptedText = encrypted.toString('hex')
  return `${salt}__${encryptedText}`;
}


const decrypt = (encrypted: string, password: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(password, 'salt', 32);
  const textParts = encrypted.split('__');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join('__'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([ decrypted, decipher.final() ]);
  return decrypted.toString();
}

const Crypto = {
  encrypt,
  decrypt,
  generateRandomPassword,
  generateEntityName,
}
export default Crypto
