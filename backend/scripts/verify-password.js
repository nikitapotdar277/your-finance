/**
 * Verify that the password you type matches the hash in .env.
 * Run from backend folder: node scripts/verify-password.js "your-password"
 * This helps debug login: if it says "Match: yes", use this exact password in the login form.
 */
import 'dotenv/config';
import bcrypt from 'bcrypt';

const password = process.argv[2];
const hash = process.env.LOGIN_PASSWORD_HASH;

if (!password) {
  console.error('Usage: node scripts/verify-password.js "your-password"');
  process.exit(1);
}

if (!hash) {
  console.error('LOGIN_PASSWORD_HASH is not set in .env');
  process.exit(1);
}

const hashTrimmed = hash.trim();
const match = await bcrypt.compare(password.trim(), hashTrimmed);
console.log('Match:', match ? 'yes' : 'no');
if (!match) {
  console.log('Hash length in .env:', hashTrimmed.length, '(bcrypt hashes are usually 60 chars)');
}
