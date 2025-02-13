import { mailTrapClient, sender } from "./mailtrap.config.js"
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplates.js"

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

export const sendWelcomeEmail = async(email, username) => {
    const recipient = [{email}];

    try {
        const response = mailTrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "1f41725c-250b-456f-95ba-8ffddee66e48",
            template_variables: {
                "company_info_name": "The Future",
                "name": username,
            }
        })

        console.log("Welcome email sent successfully", response);

    } catch (error) {
        console.log("Error sending verification mail")
        throw new Error(`Error sending verification mail: ${error}`)
    }
}

export const sendResetPasswordEmail = async(email, resetUrl) => {
    const recipient = [{email}];

    try {
        const response = mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "password reset"
        })

        console.log("Reset Password email sent successfully", response);

    } catch (error) {
        console.log("Error sending verification mail")
        throw new Error(`Error sending verification mail: ${error}`)
    }
}