const cron = require("node-cron");
const RecurringPayment = require("../models/RecurringPayment");
const Transaction = require("../models/Transaction");
const { sendNotification } = require("../socket/socket");

// Run background job once every hour to process due bills
cron.schedule("0 * * * *", async () => {
    try {
        const now = new Date();
        // Find active bills whose nextDueDate is in the past or exactly now
        const duePayments = await RecurringPayment.find({
            active: true,
            nextDueDate: { $lte: now }
        });

        for (const payment of duePayments) {
            // 1. Create Transaction expense
            await Transaction.create({
                userId: payment.userId,
                title: `[Auto-Bill] ${payment.title}`,
                amount: payment.amount,
                category: payment.category,
                type: "expense",
                description: `Automatically posted recurring subscription: ${payment.title}`,
                date: payment.nextDueDate
            });

            // 2. Compute nextDueDate based on frequency
            const nextDate = new Date(payment.nextDueDate);
            if (payment.frequency === "daily") {
                nextDate.setDate(nextDate.getDate() + 1);
            } else if (payment.frequency === "weekly") {
                nextDate.setDate(nextDate.getDate() + 7);
            } else if (payment.frequency === "yearly") {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            } else {
                // Default monthly
                nextDate.setMonth(nextDate.getMonth() + 1);
            }

            payment.nextDueDate = nextDate;
            await payment.save();

            // 3. Emit real-time WebSocket notification
            sendNotification(
                payment.userId.toString(),
                `📅 Auto-Paid subscription "${payment.title}" of ${payment.amount}!`
            );
            console.log(`Auto-payment processed for user ${payment.userId}: ${payment.title}`);
        }

    } catch (error) {
        console.error("Error executing recurring payments job:", error.message);
    }
});
