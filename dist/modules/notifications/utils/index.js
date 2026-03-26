"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationToInterest = exports.sendNotificationToUsers = exports.getTokenForUser = void 0;
const pusher_1 = require("./pusher");
// 1️⃣ Get Token for User
const getTokenForUser = async (userId) => {
    try {
        const token = await pusher_1.beamsClient.generateToken(userId);
        return token;
    }
    catch (error) {
        console.error("❌ Error generating token:", error);
        throw new Error("Failed to generate token.");
    }
};
exports.getTokenForUser = getTokenForUser;
// 3️⃣ Send Notification to Specific Users
const sendNotificationToUsers = async (userIds, titles, messages, data = {}) => {
    try {
        await pusher_1.beamsClient.publishToUsers(userIds, {
            apns: {
                aps: {
                    alert: { title: titles.en, body: messages.en },
                },
                data: {
                    title_ar: titles.ar,
                    body_ar: messages.ar,
                    ...data,
                },
            },
            fcm: {
                notification: { title: titles.en, body: messages.en },
                data: {
                    title_ar: titles.ar,
                    body_ar: messages.ar,
                    ...data,
                },
            },
        });
        console.log(`✅ Notification sent to users: ${userIds.join(", ")}`);
    }
    catch (error) {
        console.error("❌ Error sending notification to users:", error);
        throw new Error("Failed to send notification.");
    }
};
exports.sendNotificationToUsers = sendNotificationToUsers;
// 4️⃣ Send Notification to Interests
const sendNotificationToInterest = async (interest, titles, messages, data = {}) => {
    try {
        await pusher_1.beamsClient.publishToInterests([interest], {
            apns: {
                aps: {
                    alert: { title: titles.en, body: messages.en },
                },
                data: {
                    title_ar: titles.ar,
                    body_ar: messages.ar,
                    ...data,
                },
            },
            fcm: {
                notification: { title: titles.en, body: messages.en },
                data: {
                    title_ar: titles.ar,
                    body_ar: messages.ar,
                    ...data,
                },
            },
        });
        console.log(`✅ Notification sent to interest: ${interest}`);
    }
    catch (error) {
        console.error("❌ Error sending notification to interest:", error);
        throw new Error("Failed to send notification.");
    }
};
exports.sendNotificationToInterest = sendNotificationToInterest;
