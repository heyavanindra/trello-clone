import { loginSchema, signupSchema } from "@repo/common";
import { User } from "@repo/database";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const signup = async (req: Request, res: Response) => {

  const result = signupSchema.safeParse(req.body);
  console.log("Data", result.data)

  if (!result.success) {
    return res.status(400).json({ message: result.error.message });
  }

  try {
    const { email, password, name } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    return res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.message });
  }

  try {
    const { email, password } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key', 
      { expiresIn: '7d' } 
    );

    return res.status(200).json({ 
      message: "User logged in successfully",
      token,
      user: {
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { signup, login };
