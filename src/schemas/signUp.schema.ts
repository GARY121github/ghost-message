import { z } from "zod";

export const userNameValidation = z.string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
        /^[a-zA-Z0-9_]*$/,
        "Username must only contain letters, numbers, and underscores"
    );

export const signUpSchema = z
    .object({
        username: userNameValidation,
        email: z.string()
            .email({ message: "Invalid email address" })
            .max(255, "Email must be at most 255 characters long"),
        password: z.string()
            .min(6, { message: "Password must be at least 6 characters long" })
            .max(100, "Password must be at most 100 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),
        confirmPassword: z.string()
            .min(6, { message: "Password must be at least 6 characters long" })
            .max(100, "Password must be at most 100 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),
    })
    .refine((data) => data.confirmPassword === data.password, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
