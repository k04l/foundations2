import { sendEmail } from './src/utils/email.js';

async function testEmail() {
    try {
        await sendEmail({
            email: 'your-test-email@example.com', // Use your personal email for testing
            subject: 'Test Email',
            message: 'This is a test email from the application.'
        });
        console.log('Test email sent successfully');
    } catch (error) {
        console.error('Test email failed:', error);
    }
    process.exit();
}

testEmail();