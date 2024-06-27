import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10d' });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Prevent XSS (Cross-Site Scripting) attacks
    sameSite: "strict", // Mitigate CSRF (Cross-Site Request Forgery) attacks
    secure: process.env.NODE_ENV !== "development", // Ensure cookies are only sent over HTTPS in production
  });
};
