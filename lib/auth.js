import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const token = req.cookies?.token;

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
