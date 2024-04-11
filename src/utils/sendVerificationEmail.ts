import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'GHOST-MESSAGE | VERIFICATION OTP',
            react: VerificationEmail(),
        });
        return { success: false, message: "Verification email send successfully" }
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return { success: false, message: "Failed to send verification email" }
    }
}