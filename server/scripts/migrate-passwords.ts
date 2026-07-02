/**
 * Password Migration Script
 * 
 * Converts all plain text passwords in the database to bcrypt hashes.
 * This is a one-time migration from the old Java application.
 * 
 * Usage: ts-node server/scripts/migrate-passwords.ts
 */

import bcrypt from 'bcrypt';
import { query } from '../config/database';
import { config } from '../config/conf';

interface User {
  id: number;
  username: string;
  password: string;
}

const BCRYPT_ROUNDS = config.bcrypt.rounds;

async function migratePasswords() {
  console.log('🔒 Starting password migration...\n');
  
  try {
    // Get all users with plain text passwords
    const users = await query<User>('SELECT id, username, password FROM users');
    
    console.log(`Found ${users.length} users to migrate\n`);
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      try {
        // Check if password is already bcrypt hashed
        // Bcrypt hashes start with $2a$, $2b$, or $2y$
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
          console.log(`⏭️  Skipping user ${user.username} (already hashed)`);
          skippedCount++;
          continue;
        }
        
        // Hash the plain text password
        const hashedPassword = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
        
        // Update the database
        await query(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, user.id]
        );
        
        console.log(`✅ Migrated user: ${user.username}`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Error migrating user ${user.username}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${successCount}`);
    console.log(`   ⏭️  Already hashed (skipped): ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('\n✨ Password migration complete!\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Fatal error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migratePasswords();
