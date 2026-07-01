/**
 * Email Configuration Test Script
 * 
 * Usage:
 *   npm run test-email                    # Test with development config
 *   NODE_ENV=production npm run test-email # Test with production config
 * 
 * This script will:
 * 1. Test basic SMTP connection
 * 2. Send a test email to verify configuration
 * 3. Test all email templates (welcome, password reset, share)
 */

import { sendEmail, sendWelcomeEmail, sendPasswordResetEmail, sendShareEmail } from '../utils/email';
import { config } from '../config/conf';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function printConfig() {
  log('\n=== Email Configuration ===', colors.cyan);
  log(`Environment: ${config.env}`);
  log(`SMTP Host: ${config.smtp.host}`);
  log(`SMTP Port: ${config.smtp.port}`);
  log(`SMTP Secure: ${config.smtp.secure}`);
  log(`SMTP User: ${config.smtp.user}`);
  log(`From Email: ${config.smtp.from}`);
  log(`From Name: ${config.smtp.fromName}`);
  log('===========================\n', colors.cyan);
}

async function testEmailConnection() {
  log('🔍 Testing SMTP connection...', colors.blue);
  
  // The transporter.verify() in email.ts will log the result
  // Wait a moment for it to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
}

async function sendTestEmail(recipientEmail: string) {
  log(`\n📧 Sending test email to ${recipientEmail}...`, colors.blue);
  
  const success = await sendEmail({
    to: recipientEmail,
    subject: '✅ Test Email from Verlanglijstje.be',
    text: `This is a test email from Verlanglijstje.be!\n\nIf you receive this, your email configuration is working correctly!\n\nEnvironment: ${config.env}\nSMTP Host: ${config.smtp.host}\nSMTP Port: ${config.smtp.port}\n\nTest completed successfully! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">✅ Email Test Successful!</h1>
        <p>This is a test email from <strong>Verlanglijstje.be</strong>!</p>
        <p>If you receive this, your email configuration is working correctly! 🎉</p>
        
        <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Configuration Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Environment:</strong> ${config.env}</li>
            <li><strong>SMTP Host:</strong> ${config.smtp.host}</li>
            <li><strong>SMTP Port:</strong> ${config.smtp.port}</li>
            <li><strong>From Email:</strong> ${config.smtp.from}</li>
          </ul>
        </div>
        
        <p style="color: #059669; font-weight: bold;">Test completed successfully!</p>
        <p style="color: #6B7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #E5E7EB; padding-top: 15px;">
          This is an automated test email from Verlanglijstje.be email system.
        </p>
      </div>
    `
  });
  
  if (success) {
    log('✅ Test email sent successfully!', colors.green);
    return true;
  } else {
    log('❌ Failed to send test email', colors.red);
    return false;
  }
}

async function testWelcomeEmail(recipientEmail: string) {
  log(`\n👋 Testing welcome email template to ${recipientEmail}...`, colors.blue);
  
  const success = await sendWelcomeEmail(recipientEmail, 'Test User');
  
  if (success) {
    log('✅ Welcome email sent successfully!', colors.green);
    return true;
  } else {
    log('❌ Failed to send welcome email', colors.red);
    return false;
  }
}

async function testPasswordResetEmail(recipientEmail: string) {
  log(`\n🔑 Testing password reset email template to ${recipientEmail}...`, colors.blue);
  
  const testToken = 'test-token-1234567890abcdef';
  const success = await sendPasswordResetEmail(recipientEmail, 'Test User', testToken);
  
  if (success) {
    log('✅ Password reset email sent successfully!', colors.green);
    return true;
  } else {
    log('❌ Failed to send password reset email', colors.red);
    return false;
  }
}

async function testShareEmail(recipientEmail: string) {
  log(`\n🎁 Testing share notification email template to ${recipientEmail}...`, colors.blue);
  
  const testShareUrl = `${config.server.appUrl}/#/share/ABC123`;
  const success = await sendShareEmail(
    recipientEmail,
    'Test User',
    'My Test Wishlist',
    testShareUrl,
    'This is a test share notification!'
  );
  
  if (success) {
    log('✅ Share notification email sent successfully!', colors.green);
    return true;
  } else {
    log('❌ Failed to send share notification email', colors.red);
    return false;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════╗', colors.cyan);
  log('║   📧 Verlanglijstje Email Configuration Test  ║', colors.cyan);
  log('╚════════════════════════════════════════════════╝', colors.cyan);
  
  printConfig();
  
  // Get recipient email from command line argument or use default
  const recipientEmail = process.argv[2] || 'johan@coppieters.be';
  
  if (!recipientEmail || !recipientEmail.includes('@')) {
    log('❌ Error: Please provide a valid recipient email address', colors.red);
    log('Usage: npm run test-email <your-email@example.com>', colors.yellow);
    process.exit(1);
  }
  
  log(`📬 Test emails will be sent to: ${recipientEmail}`, colors.yellow);
  log('═══════════════════════════════════════════════\n', colors.cyan);
  
  await testEmailConnection();
  
  const results = [];
  
  // Test 1: Basic email
  results.push(await sendTestEmail(recipientEmail));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 2: Welcome email template
  results.push(await testWelcomeEmail(recipientEmail));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 3: Password reset email template
  results.push(await testPasswordResetEmail(recipientEmail));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 4: Share notification email template
  results.push(await testShareEmail(recipientEmail));
  
  // Summary
  log('\n═══════════════════════════════════════════════', colors.cyan);
  log('\n📊 Test Summary:', colors.cyan);
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  if (passed === total) {
    log(`✅ All tests passed! (${passed}/${total})`, colors.green);
    log('\n🎉 Email configuration is working correctly!', colors.green);
    log('Check your inbox at:', colors.green);
    log(`   ${recipientEmail}`, colors.green);
  } else {
    log(`⚠️  Some tests failed (${passed}/${total} passed)`, colors.yellow);
    log('\n💡 Troubleshooting tips:', colors.yellow);
    log('1. Check SMTP credentials in conf.dev.ts or conf.prod.ts');
    log('2. Verify SMTP host and port are correct');
    log('3. Check if port 587/465 is open on your firewall');
    log('4. Verify email account exists in Combell control panel');
    log('5. Check spam folder for received emails');
    log('6. Review server logs for detailed error messages');
  }
  
  log('\n═══════════════════════════════════════════════\n', colors.cyan);
  
  process.exit(passed === total ? 0 : 1);
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
