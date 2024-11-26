// backend/reset-password.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/your-database';

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

async function resetPassword() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Password123!', salt);
        
        // Update user
        const result = await User.findOneAndUpdate(
            { email: 'cmharmon89@gmail.com' },
            { 
                $set: { 
                    password: hashedPassword,
                    isEmailVerified: true 
                } 
            },
            { new: true }
        );
        
        console.log('Password reset result:', {
            userFound: !!result,
            email: result?.email,
            isVerified: result?.isEmailVerified,
            hashedPassword: hashedPassword
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetPassword();