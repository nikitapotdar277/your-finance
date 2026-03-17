/**
 * One-off script to generate a bcrypt hash for LOGIN_PASSWORD_HASH.
 * Run: node scripts/hash-password.js "your-password"
 */
import bcrypt from 'bcrypt';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js "your-password"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log('Add to your .env (use double quotes so the hash is read correctly):');
console.log('LOGIN_PASSWORD_HASH="' + hash + '"');
console.log('');
console.log('Then verify with: node scripts/verify-password.js "your-password"');
