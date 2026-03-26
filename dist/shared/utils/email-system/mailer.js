"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const mail_1 = __importDefault(require("./mail"));
class MailerService {
    /**
     * Sends an email using the configured transporter
     * @param email - Recipient's email address
     * @param body - Mail body containing subject, text, and template
     * @param contentMsg - Dynamic content to include in the email template
     * @param userName - Name of the recipient
     */
    async sendMail(email, body, contentMsg, userName) {
        try {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: body.subject,
                text: body.text,
                template: body.template,
                context: {
                    userName,
                    contentMsg,
                },
            };
            const info = await mail_1.default.sendMail(mailOptions);
            console.log("Message sent to user:", info.messageId);
        }
        catch (error) {
            console.error("Error in mailer:", error);
            throw error; // Optionally rethrow or handle the error
        }
    }
    async sendOtpEmail(email, otp) {
        const body = {
            subject: "OTP for account verification",
            text: `Your OTP for account verification is ${otp}`,
            template: "otp",
        };
        await this.sendMail(email, body, otp, "User");
    }
    async sendWelcomeEmail(email, userName) {
        const body = {
            subject: "Welcome to our platform",
            text: `Welcome to our platform, ${userName}`,
            template: "welcome",
        };
        await this.sendMail(email, body, "Welcome to our platform", userName);
    }
}
exports.MailerService = MailerService;
