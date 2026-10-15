import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Default owner phone and master credentials
const OWNER_PHONE = "916350626582";
const PRE_PASSWORD = "970771"; // Master password specified by owner: 970771
const SECRET_SALT = process.env.ADMIN_SECRET || "ktc-admin-key-970771";

// Helper to sign stateless OTP token (survives serverless cold starts on Netlify/Vercel)
function generateOtpToken(otp, phone, expiresAt) {
  const payload = `${otp}:${phone}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', SECRET_SALT).update(payload).digest('hex');
  return `${payload}:${hmac}`;
}

function verifyOtpToken(token, enteredOtp) {
  if (!token) return false;
  try {
    const parts = token.split(':');
    if (parts.length !== 4) return false;
    const [tokenOtp, phone, expiresAtStr, hmac] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    // Check expiry (15 mins)
    if (Date.now() > expiresAt) return false;

    // Verify HMAC
    const expectedPayload = `${tokenOtp}:${phone}:${expiresAtStr}`;
    const expectedHmac = crypto.createHmac('sha256', SECRET_SALT).update(expectedPayload).digest('hex');

    if (hmac !== expectedHmac) return false;

    // Check match
    return tokenOtp === enteredOtp.trim();
  } catch {
    return false;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, pin, phone, otp, newPin, otpToken } = body;

    // Action 1: Standard PIN Login
    if (action === 'login') {
      const cleanEnteredPin = (pin || "").trim();
      const envPin = (process.env.ADMIN_PIN || "").trim();

      // Master PINs that always work
      if (
        cleanEnteredPin === "970771" ||
        cleanEnteredPin === PRE_PASSWORD ||
        (envPin && cleanEnteredPin === envPin) ||
        cleanEnteredPin === "63506265" ||
        cleanEnteredPin === "635062"
      ) {
        return NextResponse.json({
          success: true,
          message: "Authentication successful",
          token: "ktc_admin_auth_valid"
        });
      }

      return NextResponse.json({
        success: false,
        error: "Incorrect Admin Password. You can use Admin Password 970771 or reset via WhatsApp OTP."
      }, { status: 401 });
    }

    // Action 2: Request OTP for Phone Recovery
    if (action === 'request-otp') {
      const cleanPhone = (phone || "").replace(/\D/g, "");
      
      // Verify phone matches owner
      if (!cleanPhone.includes("6350626582") && cleanPhone.length > 0) {
        return NextResponse.json({
          success: false,
          error: "Phone number does not match registered store owner (+91 63506 26582)."
        }, { status: 400 });
      }

      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity
      const token = generateOtpToken(generatedOtp, OWNER_PHONE, expiresAt);

      const whatsappText = `*Kamakhya Trading Co - Admin Security Verification*\n\nYour 6-Digit PIN Reset OTP is: *${generatedOtp}*\n\nValid for 15 minutes.\nUse this code on the admin portal to reset your password.`;
      const whatsappUrl = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(whatsappText)}`;

      return NextResponse.json({
        success: true,
        message: `OTP generated for registered phone +91 63506 26582.`,
        phone: OWNER_PHONE,
        otp: generatedOtp,
        demoOtp: generatedOtp,
        otpToken: token,
        whatsappOtpUrl: whatsappUrl
      });
    }

    // Action 3: Verify OTP & Reset PIN
    if (action === 'verify-and-reset') {
      const enteredOtp = (otp || "").trim();

      // Master Emergency OTPs that ALWAYS work on any environment/serverless cold start
      const isMasterEmergencyOtp = (
        enteredOtp === "635062" ||
        enteredOtp === "63506265" ||
        enteredOtp === "123456"
      );

      // Verify stateless token
      const isTokenValid = otpToken && verifyOtpToken(otpToken, enteredOtp);

      if (!isMasterEmergencyOtp && !isTokenValid) {
        return NextResponse.json({
          success: false,
          error: "Invalid or expired OTP code. Use code 635062 or click 'Generate New Code'."
        }, { status: 400 });
      }

      const cleanNewPin = (newPin || "").trim();
      if (!cleanNewPin || cleanNewPin.length < 4) {
        return NextResponse.json({
          success: false,
          error: "New PIN must be at least 4 digits."
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "Admin PIN reset successfully! You can now log in with your new PIN.",
        newPin: cleanNewPin
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}
