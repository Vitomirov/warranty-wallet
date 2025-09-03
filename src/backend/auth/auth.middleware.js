import jwt from "jsonwebtoken";
import { sendUnauthorized, sendForbidden } from "../core/httpResponses.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return sendUnauthorized(res, "Invalid token");

  const token = authHeader.substring(7);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return sendForbidden(res, "Token is invalid or expired");
    req.user = user;
    next();
  });
};
