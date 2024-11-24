//utils/email.js
import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import logger from './logger.js';

export const sendEmail = async (options) => {
    // Create transporter with specific Gmail settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Use Gmail service
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: config.mailUser, // Your Gmail address
        pass: config.mailPassword // Your Gmail app password
      },
      debug: true, // Enable debug logs
      logger: true // Log to console
    });
  
    const message = {
      from: `"${config.mailFromName}" <${config.mailUser}>`, // Format sender properly
      to: options.email,
      subject: options.subject,
      text: options.message
    };
  
    try {
      logger.info('Attempting to send email:', {
        to: options.email,
        subject: options.subject
      });
  
      const info = await transporter.sendMail(message);

        logger.info('Email sent successfully:', {
        messageId: info.messageId,
        response: info.response
        });
        
        return info;
     } catch (err) {
        logger.error('Email send error:', {
        error: err.message,
        code: err.code,
        response: err.response
        });
      throw new Error('Email could not be sent: ' + err.message);
    }
  };

// export const sendEmail = async (options) => {
//     // Create a transporter with specific Gmail settings
//     const transporter = nodemailer.createTransport({
//         host: config.mailHost,
//         port: config.mailPort,
//         auth: {
//             user: config.mailUsername,
//             pass: config.mailPassword
//         }
//     });

//   const message = {
//     from: `${config.fromName} <${config.fromEmail}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//   };

//   try {
//     const info = await transporter.sendMail(message);
//     logger.info('Email sent: %s', info.messageId);
//   } catch (err) {
//     logger.error('Error sending email:', err);
//     throw new Error('Email could not be sent');
//   }

//   await transporter.sendMail(message);
// };