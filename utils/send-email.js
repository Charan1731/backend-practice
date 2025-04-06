import { emailTemplates } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if(!to || !type) {
    console.error('Missing required parameters for sending email');
    throw new Error('Missing required parameters');
  }

  // Extract the number of days from the type string
  const daysLeftMatch = type.match(/(\d+) days before reminder/);
  const daysLeft = daysLeftMatch ? parseInt(daysLeftMatch[1]) : null;

  // Find the appropriate template
  let template;
  if (daysLeft) {
    template = emailTemplates.find((t) => t.label === type);
  }

  if(!template) {
    console.error(`No email template found for type: ${type}`);
    throw new Error(`Invalid email type: ${type}`);
  }

  const mailInfo = {
    userName: subscription.user?.name || 'Valued Customer',
    subscriptionName: subscription.name || 'Subscription',
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    planName: subscription.name || 'Subscription',
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod || 'Not specified',
    accountSettingsLink: '#',
    supportLink: '#',
  }

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        console.error('Error sending email:', error);
        reject(error);
        return;
      }
  
      console.log('Email sent successfully:', info.response);
      resolve(info);
    });
  });
}