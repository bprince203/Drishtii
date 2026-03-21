/**
 * Notification Service — Prajnaa Blood Bank
 * Fire-and-forget SMS (Twilio), WhatsApp (Twilio), and Email (Nodemailer).
 * Individual channel failures never block others.
 */

const twilio = require('twilio');
const nodemailer = require('nodemailer');

// ── Twilio Client ───────────────────────────────────────────────────
function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    console.warn('⚠️  Twilio credentials not set — SMS/WhatsApp disabled.');
    return null;
  }
  return twilio(sid, token);
}

// ── Nodemailer Transport ────────────────────────────────────────────
function getEmailTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn('⚠️  SMTP credentials not set — Email notifications disabled.');
    return null;
  }
  return nodemailer.createTransport({
    host,
    port: parseInt(port || '587', 10),
    secure: parseInt(port || '587', 10) === 465,
    auth: { user, pass },
  });
}

/**
 * Send SMS via Twilio.
 * @param {string} to - E.164 phone number
 * @param {string} message - SMS body
 */
async function sendSMS(to, message) {
  const client = getTwilioClient();
  if (!client) {
    console.log(`[SMS SKIP] Twilio not configured. Would send to ${to}`);
    return;
  }
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`[SMS OK] Sent to ${to}`);
  } catch (err) {
    console.error(`[SMS FAIL] ${to}: ${err.message}`);
  }
}

/**
 * Send WhatsApp message via Twilio.
 * @param {string} to - E.164 phone number (without whatsapp: prefix)
 * @param {string} message - Message body
 */
async function sendWhatsApp(to, message) {
  const client = getTwilioClient();
  if (!client) {
    console.log(`[WHATSAPP SKIP] Twilio not configured. Would send to ${to}`);
    return;
  }
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER, // format: whatsapp:+14155...
      to: `whatsapp:${to}`,
    });
    console.log(`[WHATSAPP OK] Sent to ${to}`);
  } catch (err) {
    console.error(`[WHATSAPP FAIL] ${to}: ${err.message}`);
  }
}

/**
 * Send email via Nodemailer SMTP.
 * @param {string} to - Email address
 * @param {string} subject - Subject line
 * @param {string} html - HTML body
 */
async function sendEmail(to, subject, html) {
  const transport = getEmailTransport();
  if (!transport) {
    console.log(`[EMAIL SKIP] SMTP not configured. Would send to ${to}`);
    return;
  }
  try {
    await transport.sendMail({
      from: `"Prajnaa Blood Bank" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[EMAIL OK] Sent to ${to}`);
  } catch (err) {
    console.error(`[EMAIL FAIL] ${to}: ${err.message}`);
  }
}

// Blood group enum → display label
const BLOOD_GROUP_DISPLAY = {
  A_POS: 'A+', A_NEG: 'A−', B_POS: 'B+', B_NEG: 'B−',
  AB_POS: 'AB+', AB_NEG: 'AB−', O_POS: 'O+', O_NEG: 'O−',
};

/**
 * Notify all matched donors about an emergency request.
 * Fire-and-forget — one donor failure never blocks others.
 *
 * @param {Array<{email: string, phone: string, whatsapp?: string|null, name: string}>} donors
 * @param {{bloodGroup: string, city: string, hospitalName: string, contactPhone: string}} request
 * @returns {Promise<string[]>} channels used per donor
 */
async function notifyDonors(donors, request) {
  const bgLabel = BLOOD_GROUP_DISPLAY[request.bloodGroup] || request.bloodGroup;

  const allChannels = [];

  const donorPromises = donors.map(async (donor) => {
    const channels = [];

    const smsMsg = `🚨 PRAJNAA BLOOD ALERT\n${bgLabel} blood needed at ${request.hospitalName}, ${request.city}.\nContact: ${request.contactPhone}\nDear ${donor.name}, please respond if you can donate.`;

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
        <h2 style="color:#e11d48;">🚨 Emergency Blood Request</h2>
        <p>Dear <strong>${donor.name}</strong>,</p>
        <p><strong>${bgLabel}</strong> blood is urgently needed:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Hospital</td><td style="padding:8px;border:1px solid #e2e8f0;">${request.hospitalName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">City</td><td style="padding:8px;border:1px solid #e2e8f0;">${request.city}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Contact</td><td style="padding:8px;border:1px solid #e2e8f0;"><a href="tel:${request.contactPhone}">${request.contactPhone}</a></td></tr>
        </table>
        <p>If you are available and willing to donate, please contact the hospital directly.</p>
        <p style="color:#64748b;font-size:12px;margin-top:24px;">— Prajnaa AI Health Platform</p>
      </div>`;

    const results = await Promise.allSettled([
      sendSMS(donor.phone, smsMsg),
      sendWhatsApp(donor.whatsapp || donor.phone, smsMsg),
      sendEmail(donor.email, `🚨 ${bgLabel} Blood Needed — ${request.hospitalName}`, emailHtml),
    ]);

    results.forEach((r, i) => {
      const ch = ['sms', 'whatsapp', 'email'][i];
      if (r.status === 'fulfilled') {
        channels.push(ch);
      } else {
        console.error(`[NOTIFY] ${donor.name} ${ch} failed:`, r.reason?.message);
      }
    });

    console.log(`[NOTIFY] ${donor.name}: channels=${channels.join(',') || 'none'}`);
    allChannels.push(channels);
    return channels;
  });

  await Promise.allSettled(donorPromises);
  return allChannels;
}

module.exports = { sendSMS, sendWhatsApp, sendEmail, notifyDonors };
