"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@repo/common"; // Kept your imports exactly as is
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter(); // Keep for safety, though context handles redirect
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const createEvent = async (data: LoginInput) => {
    try {
      const response = await api.post("/auth/login", data);

      // Token will be handled by the context's login function

      return response;

      return response;
    } catch (error) {
      throw error;
    }
  };

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    console.log("Form Data:", data);
    toast.promise(createEvent(data), {
      loading: "Logging in...",
      success: (response) => {
        if (response.data.token) {
          login(response.data.token);
        }
        return "Logged in successfully";
      },
      error: (error) => {
        return "Failed to login";
      },
    });
  };
  return (
    // Changed background to neutral
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 selection:bg-neutral-200">
      {/* Changed Card styling: Added inner top highlight (inset white) and soft bottom shadow for depth */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 max-w-md w-full shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-500">
            Enter your details to access your workspace
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              // Input styling: inner shadow for recessed look, neutral borders
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white transition-all"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "Password must contain uppercase, lowercase, and number",
                },
              })}
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white transition-all"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            // Button styling: Dark neutral, top white inset (highlight), bottom dark shadow
            className="w-full bg-neutral-900 text-white py-3 rounded-xl font-medium shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 hover:shadow-[0_6px_8px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-px active:translate-y-0 active:shadow-none transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-neutral-900 hover:text-neutral-700 font-medium underline underline-offset-2 decoration-neutral-300 hover:decoration-neutral-500 transition-all"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
