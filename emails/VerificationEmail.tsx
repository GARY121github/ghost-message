import {
    Html,
    Button
} from "@react-email/components";


export default function VerificationEmail() {
    return (
        <Html lang="en" dir="ltr">
            <Button href="https://example.com" style={{ color: "#61dafb" }}>
                Click me
            </Button>
        </Html>
    )
}