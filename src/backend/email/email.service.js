import { transporter } from "./email.transporter.js";
import { validatePdfFile } from "./email.helpers.js";

// Function to send a warranty claim email
export async function sendWarrantyClaimEmail(
  sellersEmail,
  productName,
  username,
  userEmail,
  userData,
  issueDescription,
  pdfFilePath
) {
  const { fullName, userAddress, userPhoneNumber } = userData;
  const subject = `Customer Warranty Claim – ${productName}`;
  const text = `
Hi there,

My name is ${fullName}, and I recently purchased a ${productName} from you. I've encountered an issue:
- ${issueDescription}

Could you please arrange to pick up the product from my address:
${userAddress}?

I've attached the warranty. Feel free to reach out to me at ${userPhoneNumber}.

Best regards,
${username}
`;

  validatePdfFile(pdfFilePath);

  const mailOptions = {
    from: userEmail,
    to: sellersEmail,
    subject,
    text,
    replyTo: userEmail,
    attachments: [{ filename: "warranty.pdf", path: pdfFilePath }],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully with attachment:", info.messageId);
    return info;
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Function to send an expiration notification email
export async function sendExpirationNotificationEmail(
  userEmail,
  productName,
  fullName
) {
  const subject = `Warranty Expiration Notification – ${productName}`;
  const text = `
Hi ${fullName},

This is a reminder that your warranty for ${productName} is about to expire in 14 days.

Please take the necessary actions.

Best regards,
Warranty Wallet Team
`;

  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: userEmail,
    subject,
    text,
    replyTo: process.env.MAIL_FROM_ADDRESS,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      "Expiration notification email sent successfully:",
      info.messageId
    );
    return info;
  } catch (error) {
    console.error(
      "Error sending expiration notification email:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
