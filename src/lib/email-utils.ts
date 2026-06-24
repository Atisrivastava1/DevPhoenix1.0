import { Resend } from 'resend';

export async function sendLeadEmail(lead: any) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = ['devphoenix@zohomail.in', 'devphoenix04@gmail.com'];
  const adminEmail = recipients.join(', ');
  const timestamp = new Date().toLocaleString();

  console.log(`[Email Dispatch] Triggering Resend notification/auto-reply for lead: ${lead.name}`);

  // Formulate Admin Notification details
  const adminSubject = `New Website Lead - ${lead.program || 'General Inquiry'}`;
  const adminText = `
New Lead Submission Details:
----------------------------
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
College/Organization: ${lead.college || 'N/A'}
Program: ${lead.program || 'General Inquiry'}
Message: ${lead.message || 'None'}
Source Page: ${lead.source_page || 'Unknown'}
Timestamp: ${timestamp}
  `;
  const adminHtml = `
    <div style="font-family: sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; background-color: #ffffff;">
      <h2 style="color: #ff5a1f; margin-top: 0; font-size: 24px; border-bottom: 2px solid #ff5a1f; padding-bottom: 10px;">🔥 New Website Lead</h2>
      <p style="color: #475569; font-size: 16px;">A new lead has been captured from the DevPhoeniX website:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px;">
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 180px;">Name:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b;">Email Address:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><a href="mailto:${lead.email}" style="color: #ff5a1f; text-decoration: none;">${lead.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b;">Phone Number:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><a href="tel:${lead.phone}" style="color: #ff5a1f; text-decoration: none;">${lead.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b;">College / Organization:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${lead.college || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b;">Program Interested In:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #ff5a1f; font-weight: 600;">${lead.program || 'General Inquiry'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b;">Source Page:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${lead.source_page || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b;">Timestamp:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${timestamp}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; vertical-align: top; color: #64748b;">Message:</td>
          <td style="padding: 10px 0; color: #0f172a; white-space: pre-line;">${lead.message || 'N/A'}</td>
        </tr>
      </table>
    </div>
  `;

  // Formulate Auto Reply details
  const autoReplySubject = `Thank You for Contacting DEVPHOENIX`;
  const autoReplyHtml = `
    <div style="font-family: sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #ff5a1f; margin: 0; font-size: 24px; font-weight: 800;">DEVPHOENIX</h2>
        <p style="color: #64748b; font-size: 12px; text-transform: uppercase; tracking-widest: 2px; margin-top: 5px;">#FollowTheRise</p>
      </div>
      <p style="color: #0f172a; font-size: 16px; font-weight: 600;">Hi ${lead.name},</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">
        Thank you for contacting DEVPHOENIX! We have received your inquiry regarding our <strong>${lead.program || 'Industrial Training Programs'}</strong>.
      </p>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">
        Our admissions committee and program advisors are reviewing your details. A dedicated mentor will reach out to you shortly via phone or email to help plan your personalized learning path.
      </p>
      <div style="margin: 25px 0; padding: 15px; background-color: #fff9f5; border: 1px solid #ff5a1f/10; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #475569;">
          Need to speak with us immediately? Connect with us on WhatsApp:
        </p>
        <a href="https://wa.me/919734876490" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px;">
          Chat on WhatsApp
        </a>
      </div>
      <p style="color: #64748b; font-size: 13px; margin-top: 25px; border-top: 1px solid #f1f5f9; padding-top: 15px;">
        Best regards,<br/>
        <strong>DevPhoeniX Admissions Team</strong><br/>
        <a href="mailto:contact@devphoenix.com" style="color: #ff5a1f; text-decoration: none;">contact@devphoenix.com</a>
      </p>
    </div>
  `;

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY environment variable not set. Running email dispatch in simulated mode.');
    console.log(`
--- SIMULATED ADMIN NOTIFICATION EMAIL ---
From: DevPhoeniX Alerts <onboarding@resend.dev>
To: ${adminEmail}
Subject: ${adminSubject}
Content:
${adminText}
------------------------------------------

--- SIMULATED USER AUTO-REPLY EMAIL ---
From: DEVPHOENIX Team <onboarding@resend.dev>
To: ${lead.email}
Subject: ${autoReplySubject}
---------------------------------------
    `);
    return { success: true, simulated: true };
  }

  try {
    const resendClient = new Resend(apiKey);

    // 1. Send notification to admin
    const adminResponse = await resendClient.emails.send({
      from: 'DevPhoeniX Alerts <onboarding@resend.dev>',
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml,
    });

    console.log(`[Email Dispatch] Admin notification queued:`, adminResponse);

    // 2. Send confirmation to user
    const userResponse = await resendClient.emails.send({
      from: 'DEVPHOENIX Team <onboarding@resend.dev>',
      to: lead.email,
      subject: autoReplySubject,
      html: autoReplyHtml,
    });

    console.log(`[Email Dispatch] User confirmation queued:`, userResponse);

    return { success: true, adminEmailId: adminResponse.data?.id, userEmailId: userResponse.data?.id };
  } catch (error) {
    console.error('❌ [Email Dispatch] Resend API error:', error);
    // Graceful error return so database write and success responses succeed
    return { success: false, error };
  }
}
