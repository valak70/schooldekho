import pool from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !name) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP in DB
    await pool.query(
      "INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    // Send OTP email
    await sendOtpEmail(email, otp);

    return new Response(JSON.stringify({ message: "OTP sent to email" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}



