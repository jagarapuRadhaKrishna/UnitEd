// Email notification service
// In production, this would connect to a backend API that sends actual emails

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (notification: EmailNotification): Promise<boolean> => {
  // Simulate email sending
  console.log('📧 Sending email:', notification);
  
  // In production, this would call your backend API:
  // await fetch('/api/send-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(notification),
  // });
  
  return true;
};

export const sendHackathonRegistrationEmail = (userEmail: string, hackathonName: string, hackathonDetails: any) => {
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #6C47FF; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
        .detail-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Registration Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hi there!</h2>
          <p>You've successfully registered for <strong>${hackathonName}</strong>!</p>
          
          <div class="detail-row">
            <strong>📅 Date:</strong> ${hackathonDetails.date || 'TBA'}
          </div>
          <div class="detail-row">
            <strong>📍 Location:</strong> ${hackathonDetails.location || 'Virtual'}
          </div>
          <div class="detail-row">
            <strong>⏰ Time:</strong> ${hackathonDetails.time || 'TBA'}
          </div>
          
          <p>We're excited to have you participate! Here's what to do next:</p>
          <ul>
            <li>Mark your calendar</li>
            <li>Prepare your development environment</li>
            <li>Review the hackathon rules and guidelines</li>
            <li>Join our Discord/Slack community</li>
          </ul>
          
          <a href="#" class="button">View Event Details</a>
          
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Good luck! 🚀</p>
        </div>
        <div class="footer">
          <p>This email was sent by InnovateHub</p>
          <p>If you did not register for this event, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `✅ Registration Confirmed: ${hackathonName}`,
    html: emailTemplate,
  });
};

export const sendApplicationConfirmationEmail = (
  userEmail: string,
  projectTitle: string,
  applicationDetails: any
) => {
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
        .status { background: #ecfdf5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Application Submitted!</h1>
        </div>
        <div class="content">
          <h2>Thank you for applying!</h2>
          <p>Your application for <strong>${projectTitle}</strong> has been successfully submitted.</p>
          
          <div class="status">
            <strong>Application Status:</strong> Under Review 📋
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>The project leader will review your application</li>
            <li>You'll receive an email when they make a decision</li>
            <li>Typical review time: 2-3 business days</li>
          </ul>
          
          ${applicationDetails.coverLetter ? `
            <p><strong>Your Cover Letter:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 5px; border-left: 3px solid #6C47FF;">${applicationDetails.coverLetter.substring(0, 200)}...</p>
          ` : ''}
          
          <a href="#" class="button">View Application Status</a>
          
          <p>Keep exploring other opportunities while you wait!</p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation from InnovateHub</p>
          <p>You can manage your applications from your dashboard.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `✅ Application Submitted: ${projectTitle}`,
    html: emailTemplate,
  });
};

export const sendTeamInvitationEmail = (userEmail: string, projectTitle: string, inviterName: string) => {
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #F59E0B; color: white; text-decoration: none; border-radius: 5px; margin: 20px 10px; }
        .button.secondary { background: white; color: #F59E0B; border: 2px solid #F59E0B; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #F59E0B; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 You're Invited!</h1>
        </div>
        <div class="content">
          <h2>Great news!</h2>
          <p><strong>${inviterName}</strong> has invited you to join their project:</p>
          
          <div class="highlight">
            <h3 style="margin-top: 0;">${projectTitle}</h3>
            <p>You've been selected based on your skills and experience!</p>
          </div>
          
          <p><strong>Why you were selected:</strong></p>
          <ul>
            <li>Your skills match the project requirements</li>
            <li>Strong profile and portfolio</li>
            <li>High collaboration rating</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="#" class="button">Accept Invitation</a>
            <a href="#" class="button secondary">View Project Details</a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            This invitation will expire in 7 days. Respond soon to secure your spot!
          </p>
        </div>
        <div class="footer">
          <p>You received this invitation through InnovateHub</p>
          <p>Not interested? You can decline from your notifications.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `🎉 You're Invited to Join: ${projectTitle}`,
    html: emailTemplate,
  });
};
