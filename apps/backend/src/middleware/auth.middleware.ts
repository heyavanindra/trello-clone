import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
