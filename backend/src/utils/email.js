const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter based on environment
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production - using SendGrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    // Development - using Ethereal
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER || 'test@ethereal.email',
        pass: process.env.ETHEREAL_PASS || 'test123',
      },
    });
  }
};

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@ecommerce.com',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== 'production') {
      logger.info('Email sent: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

const sendWelcomeEmail = async (user, token) => {
  const message = `Welcome to our e-commerce platform, ${user.name}! Please verify your email by clicking on the following link: ${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Welcome to Our E-Commerce Platform!</h1>
      <p>Hello ${user.name},</p>
      <p>Thank you for registering with us. We're excited to have you on board!</p>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${process.env.FRONTEND_URL}/verify-email/${token}" 
         style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
        Verify Email Address
      </a>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${process.env.FRONTEND_URL}/verify-email/${token}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <p>Best regards,<br>The E-Commerce Team</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Welcome! Please verify your email',
    message,
    html,
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const message = `You requested a password reset. Please click on the following link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Password Reset Request</h1>
      <p>Hello ${user.name},</p>
      <p>We received a request to reset your password. If you made this request, please click the button below to set a new password:</p>
      <a href="${process.env.FRONTEND_URL}/reset-password/${token}" 
         style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
        Reset Password
      </a>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${process.env.FRONTEND_URL}/reset-password/${token}</p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
      <p>Best regards,<br>The E-Commerce Team</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    message,
    html,
  });
};

const sendOrderConfirmationEmail = async (user, order) => {
  const message = `Thank you for your order! Your order number is ${order.orderNumber}. We'll notify you once your order ships.`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Order Confirmation</h1>
      <p>Hello ${user.name},</p>
      <p>Thank you for your order! We've received your order and will begin processing it right away.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
      <p>You can track your order status by logging into your account.</p>
      <p>If you have any questions about your order, please contact our support team.</p>
      <p>Best regards,<br>The E-Commerce Team</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    message,
    html,
  });
};

const sendOrderShippedEmail = async (user, order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Your Order Has Shipped!</h1>
      <p>Hello ${user.name},</p>
      <p>Great news! Your order has shipped and is on its way to you.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
      <p><strong>Carrier:</strong> ${order.carrier}</p>
      <p>You can track your shipment using the tracking number above on the carrier's website.</p>
      <p>Estimated Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br>The E-Commerce Team</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Your Order Has Shipped - ${order.orderNumber}`,
    message: `Your order ${order.orderNumber} has shipped. Tracking number: ${order.trackingNumber}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
};
