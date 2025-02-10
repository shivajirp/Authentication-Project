import { mailTrapClient, sender } from "./mailtrap.config.js"
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];
    console.log("recepient defined")

    try {
        const response = mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })

        console.log("Email sent successfully", response);

    } catch (error) {
        console.log("Error sending verification mail", error)
        throw new Error("Error sending verification mail", error)
    }
}