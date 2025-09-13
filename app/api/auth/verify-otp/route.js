import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp, name, password } = body;

    if (!email || !otp || !name) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    // 1. Check OTP validity
    const [rows] = await pool.query(
      "SELECT * FROM otps WHERE email = ? AND otp = ? ORDER BY created_at DESC LIMIT 1",
      [email, otp]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
      });
    }

    const record = rows[0];
    if (new Date(record.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "OTP expired" }), {
        status: 400,
      });
    }

    // 2. Check if user already exists
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // 3. Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // 4. Create user
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // 5. Cleanup OTPs
    await pool.query("DELETE FROM otps WHERE email = ?", [email]);

    return new Response(
      JSON.stringify({ message: "User registered successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Verify OTP error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
