// Quick script to generate bcrypt hash for a password
const bcrypt = require('bcrypt');

const password = process.argv[2] || 'Gibson165';
const rounds = 10;

bcrypt.hash(password, rounds).then(hash => {
  console.log('\nPassword:', password);
  console.log('Bcrypt hash:', hash);
  console.log('\nUpdate your database with:');
  console.log(`UPDATE users SET password = '${hash}' WHERE username = 'Johan577';\n`);
});
