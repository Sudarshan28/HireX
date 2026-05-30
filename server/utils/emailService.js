const nodemailer = require('nodemailer');

let transporter = null;

// Lazy initialization of transporter
const getTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    console.log(`Configuring custom SMTP mail server at ${host}:${port}...`);
    transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: process.env.SMTP_SECURE === 'true' || port == 465,
      auth: { user, pass },
    });
  } else {
    try {
      console.log('No custom SMTP details found in .env. Creating test email account via Ethereal.email...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`\n==================================================`);
      console.log('ETHEREAL MOCK MAIL SERVER INSTANTIATED!');
      console.log(`User: ${testAccount.user}`);
      console.log('You can preview sent emails in your terminal output!');
      console.log(`==================================================\n`);
    } catch (err) {
      console.warn('Failed to create dynamic Ethereal account, falling back to terminal log transporter:', err.message);
      transporter = {
        sendMail: async (options) => {
          console.log('\n==================================================');
          console.log('MOCK EMAIL SEND LOG (FALLBACK):');
          console.log(`From: ${options.from}`);
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`Body (Plain Text): \n${options.text}`);
          console.log('==================================================\n');
          return { messageId: 'console-log-fallback-id' };
        }
      };
    }
  }

  return transporter;
};

// Generic email sender helper
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const clientTransporter = await getTransporter();
    const fromName = 'HireX Platform';
    const fromEmail = process.env.SMTP_FROM || 'notifications@hirex.co';
    
    const info = await clientTransporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text,
      html
    });

    console.log(`Email dispatched successfully! MessageID: ${info.messageId}`);
    
    // If it's an ethereal test account, log preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n📥 [Email Sandbox Preview URL]: ${previewUrl}\n`);
    }
    
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (err) {
    console.error('Email service dispatch failed:', err);
    return { success: false, error: err.message };
  }
};

/**
 * 1. Recruiter confirmation on posting a job
 */
exports.sendJobPostedEmail = async (recruiterEmail, recruiterName, jobTitle) => {
  const subject = `Job Posted Successfully: ${jobTitle}`;
  const text = `Hello ${recruiterName},\n\nYour job opening for "${jobTitle}" has been posted successfully on the HireX platform. You will receive email notifications as soon as candidates submit applications.\n\nBest regards,\nHireX Team`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
      <h2 style="color: #202A36; font-size: 20px; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">HIREX OPPORTUNITY SYSTEM</h2>
      <p style="font-size: 14px; color: #4a5568;">Hello <strong>${recruiterName}</strong>,</p>
      <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">Your job opening for <strong>${jobTitle}</strong> was successfully posted. It is now live in the candidate jobs feed.</p>
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #edf2f7;">
        <span style="font-size: 12px; font-weight: bold; color: #718096; text-transform: uppercase;">Job Role</span>
        <div style="font-size: 16px; font-weight: bold; color: #2d3748; margin-top: 5px;">${jobTitle}</div>
      </div>
      <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">We will notify you immediately when matching student profiles apply to this role.</p>
      <p style="font-size: 12px; color: #a0aec0; margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 15px;">Best regards,<br><strong>HireX Team</strong></p>
    </div>
  `;

  return await sendEmail({ to: recruiterEmail, subject, text, html });
};

/**
 * 2. Recruiter notification when a candidate applies
 */
exports.sendApplicationReceivedEmail = async (recruiterEmail, recruiterName, jobTitle, candidateName, matchScore) => {
  const subject = `New Job Application: ${candidateName} for ${jobTitle}`;
  const text = `Hello ${recruiterName},\n\nA candidate named "${candidateName}" has applied for your job opening for "${jobTitle}".\n\nAI Match Score: ${matchScore}%\n\nPlease check your Recruiter Dashboard to review the application and download the resume PDF.\n\nBest regards,\nHireX Team`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
      <h2 style="color: #202A36; font-size: 20px; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">NEW CANDIDATE APPLICATION</h2>
      <p style="font-size: 14px; color: #4a5568;">Hello <strong>${recruiterName}</strong>,</p>
      <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">A student profile has applied to your open job vacancy.</p>
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #edf2f7; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <span style="font-size: 11px; font-weight: bold; color: #718096; text-transform: uppercase; display: block;">Applicant</span>
          <strong style="font-size: 15px; color: #2d3748;">${candidateName}</strong>
          <span style="font-size: 12px; color: #718096; display: block; margin-top: 5px;">Applied for: ${jobTitle}</span>
        </div>
        <div style="text-align: right; margin-left: auto;">
          <span style="font-size: 11px; font-weight: bold; color: #718096; text-transform: uppercase; display: block;">AI Match Rating</span>
          <span style="display: inline-block; background-color: #e6fffa; border: 1px solid #b2f5ea; color: #319795; font-size: 16px; font-weight: bold; padding: 5px 12px; border-radius: 6px; margin-top: 5px;">${matchScore}%</span>
        </div>
      </div>
      <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">Log in to the Recruiter Dashboard to review details, skills profile, and view the full resume PDF.</p>
      <p style="font-size: 12px; color: #a0aec0; margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 15px;">Best regards,<br><strong>HireX Team</strong></p>
    </div>
  `;

  return await sendEmail({ to: recruiterEmail, subject, text, html });
};

/**
 * 3. Student notification on application status update
 */
exports.sendStatusUpdatedEmail = async (studentEmail, studentName, jobTitle, companyName, status) => {
  const subject = `Application Status Update: ${companyName} (${jobTitle})`;
  
  // Custom text description based on status
  let statusText = 'Pending';
  let statusBg = '#ebf8ff';
  let statusColor = '#3182ce';
  let descText = 'Your application is currently under review by the hiring manager.';

  if (status.toLowerCase() === 'shortlisted') {
    statusText = 'Shortlisted';
    statusBg = '#feebc8';
    statusColor = '#dd6b20';
    descText = 'Congratulations! The hiring team has shortlisted your profile for the next rounds. They will contact you shortly to schedule an interview.';
  } else if (status.toLowerCase() === 'hired') {
    statusText = 'Hired';
    statusBg = '#e6fffa';
    statusColor = '#319795';
    descText = 'Wonderful news! You have been offered the position. The HR manager will email you the official offer details soon.';
  } else if (status.toLowerCase() === 'rejected') {
    statusText = 'Rejected';
    statusBg = '#fed7d7';
    statusColor = '#e53e3e';
    descText = 'The hiring team decided not to move forward with your application at this stage. We wish you the best in your job hunt and encourage you to apply for other matches.';
  }

  const text = `Hello ${studentName},\n\nThe status of your application for "${jobTitle}" at "${companyName}" has been updated to: ${statusText}.\n\n${descText}\n\nBest regards,\nHireX Team`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
      <h2 style="color: #202A36; font-size: 20px; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">APPLICATION PIPELINE STATUS CHANGE</h2>
      <p style="font-size: 14px; color: #4a5568;">Hello <strong>${studentName}</strong>,</p>
      <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">There is an update on your job application submission.</p>
      
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #edf2f7;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td>
              <span style="font-size: 11px; font-weight: bold; color: #718096; text-transform: uppercase;">Company</span>
              <strong style="font-size: 15px; color: #2d3748; display: block; margin-top: 3px;">${companyName}</strong>
              <span style="font-size: 12px; color: #718096; display: block; margin-top: 3px;">Role: ${jobTitle}</span>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="font-size: 11px; font-weight: bold; color: #718096; text-transform: uppercase; display: block;">Status</span>
              <span style="display: inline-block; background-color: ${statusBg}; color: ${statusColor}; font-size: 14px; font-weight: bold; padding: 6px 14px; border-radius: 6px; margin-top: 5px; border: 1px solid currentColor;">${statusText}</span>
            </td>
          </tr>
        </table>
      </div>
      
      <p style="font-size: 14px; color: #2d3748; font-weight: 500; line-height: 1.6; background-color: #f7fafc; padding: 12px; border-left: 4px solid #202A36; border-radius: 0 4px 4px 0;">
        ${descText}
      </p>
      
      <p style="font-size: 12px; color: #a0aec0; margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 15px;">Best regards,<br><strong>HireX Team</strong></p>
    </div>
  `;

  return await sendEmail({ to: studentEmail, subject, text, html });
};
