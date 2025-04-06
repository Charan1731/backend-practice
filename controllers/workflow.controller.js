import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

const REMINDERS = [7, 5, 2, 1]

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if(!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');
    const reminderLabel = `${daysBefore} days before reminder`;

    if(reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, reminderLabel, reminderDate);
    }

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, reminderLabel, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    try {
      const subscription = await Subscription.findById(subscriptionId).populate('user', 'name email');
      
      if (!subscription) {
        console.error(`Subscription not found: ${subscriptionId}`);
        return null;
      }
      
      if (!subscription.user || !subscription.user.email) {
        console.error(`User or user email not found for subscription: ${subscriptionId}`);
        return null;
      }
      
      return subscription;
    } catch (error) {
      console.error(`Error fetching subscription ${subscriptionId}:`, error);
      return null;
    }
  })
}

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    try {
      await sendReminderEmail({
        to: subscription.user.email,
        type: label,
        subscription,
      });
      console.log(`Successfully sent ${label} reminder email to ${subscription.user.email}`);
    } catch (error) {
      console.error(`Failed to send ${label} reminder email:`, error);
      throw error; // Rethrow to let the workflow system know about the failure
    }
  })
}