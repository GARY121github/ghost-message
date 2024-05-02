import {
    Html,
    Button
} from "@react-email/components";


export default function VerificationEmail({ verificationCode }: { verificationCode: string }) {
    return (
        <Html lang="en" dir="ltr">
            <Button href="https://example.com" style={{ color: "#61dafb" }}>
                Click me
            </Button>
            <h1>Verification Code is {verificationCode}</h1>
        </Html>
    )
}