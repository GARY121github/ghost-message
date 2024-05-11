import { z } from 'zod';

export const signInSchema = z.object({
    identifier: z.string().email({ message: "Invalid email address" })
        .max(255, "Email must be at most 255 characters long"),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, "Password must be at most 100 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
});