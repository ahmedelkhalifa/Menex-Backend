package com.app.menex.mailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class MailService {

    private final JavaMailSender mailSender;
    @Value("${menex.frontendURL}")
    private String frontendUrl;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendHtmlMail(String to, String subject, String body) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setFrom("${spring.mail.username}");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);

        mailSender.send(mimeMessage);
    }

    public void sendSubscriptionActivated(String toEmail, String username, String planType, LocalDateTime endDate) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        String formattedDate = endDate.format(formatter);

        String htmlContent = buildActivationEmail(username, planType, formattedDate);

        helper.setText(htmlContent, true);
        helper.setTo(toEmail);
        helper.setSubject("🎉 Your MENEX Subscription is Active!");
        helper.setFrom("${spring.mail.username}");

        mailSender.send(mimeMessage);
    }

    public void sendRenewalConfirmation(String toEmail, String username, LocalDateTime newEndDate) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        String formattedDate = newEndDate.format(formatter);

        String htmlContent = buildRenewalEmail(username, formattedDate);

        helper.setText(htmlContent, true);
        helper.setTo(toEmail);
        helper.setSubject("✅ MENEX Subscription Renewed Successfully");
        helper.setFrom("${spring.mail.username}");

        mailSender.send(mimeMessage);
    }

    public void sendExpiryWarning(String toEmail, String username, LocalDateTime endDate) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        // Format the date nicely (e.g., "12 Feb 2026")
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        String formattedDate = endDate.format(formatter);

        String htmlContent = buildExpiryEmail(username, formattedDate);

        helper.setText(htmlContent, true); // true = send as HTML
        helper.setTo(toEmail);
        helper.setSubject("⚠ Action Required: Your MENEX Subscription Expires in 5 Days");
        helper.setFrom("${spring.mail.username}");

        mailSender.send(mimeMessage);
    }

    public void sendSubscriptionExpired(String toEmail, String username, LocalDateTime expiryDate) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        String formattedDate = expiryDate.format(formatter);

        String htmlContent = buildExpiredEmail(username, formattedDate);

        helper.setText(htmlContent, true);
        helper.setTo(toEmail);
        helper.setSubject("⛔ Action Required: MENEX Subscription Expired");
        helper.setFrom("${spring.mail.username}");

        mailSender.send(mimeMessage);
    }

    public void sendCancellationConfirmation(String toEmail, String username, LocalDateTime endDate) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        String formattedDate = endDate.format(formatter);

        String htmlContent = buildCancellationEmail(username, formattedDate);

        helper.setText(htmlContent, true);
        helper.setTo(toEmail);
        helper.setSubject("Subscription Cancelled - MENEX");
        helper.setFrom("${spring.mail.username}");

        mailSender.send(mimeMessage);
    }

    private String buildExpiryEmail(String name, String expiryDate) {
        return """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Client-specific resets */
            body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }
            
            /* Theme Fonts */
            body { 
                font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; 
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F6F8F7; width: 100%%;">
        <center>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #F6F8F7;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            
                            <tr>
                                <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #E0E5E3;">
                                    <h2 style="margin: 0; font-family: 'Inter', sans-serif; color: #6FBF73; font-weight: 700; font-size: 24px; letter-spacing: -0.5px;">
                                        MENEX
                                    </h2>
                                    <span style="font-size: 12px; color: #5F6F6F; text-transform: uppercase; letter-spacing: 2px;">Digital Menus</span>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 40px; color: #2E3A3A; font-size: 16px; line-height: 1.6;">
                                    <h3 style="margin-top: 0; margin-bottom: 20px; font-weight: 600; font-size: 20px; color: #d32f2f;">⚠️ Action Required</h3>
                                    
                                    <p style="margin: 0 0 20px 0;">Hello <strong>%s</strong>,</p>
                                    
                                    <p style="margin: 0 0 20px 0;">
                                        Your MENEX subscription is expiring soon. To ensure your digital menu stays online without interruption, please renew your plan.
                                    </p>
                                    
                                    <div style="background-color: #FFF4E5; border-left: 4px solid #FF9800; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                                        <p style="margin: 0; font-size: 14px; color: #663C00;">
                                            <strong>Expiry Date:</strong> %s
                                        </p>
                                    </div>

                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%">
                                        <tr>
                                            <td align="center">
                                                <a href="%s/contact-us" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #6FBF73; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 16px; mso-padding-alt: 0;">
                                                    <span style="mso-text-raise: 15pt;">Renew Subscription</span>
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin-top: 30px; margin-bottom: 0; font-size: 14px; color: #5F6F6F;">
                                        If you have already sent the payment, please ignore this email or contact support.
                                    </p>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 0 40px 30px 40px; text-align: center; color: #5F6F6F; font-size: 13px;">
                                    <p style="margin: 0;">&copy; 2026 MENEX Digital Menus. All rights reserved.</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    """.formatted(name, expiryDate, frontendUrl);
    }

    private String buildActivationEmail(String name, String planType, String expiryDate) {
        return """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }
            body { font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F6F8F7; width: 100%%;">
        <center>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #F6F8F7;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            
                            <tr>
                                <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #E0E5E3;">
                                    <h2 style="margin: 0; font-family: 'Inter', sans-serif; color: #6FBF73; font-weight: 700; font-size: 24px; letter-spacing: -0.5px;">
                                        MENEX
                                    </h2>
                                    <span style="font-size: 12px; color: #5F6F6F; text-transform: uppercase; letter-spacing: 2px;">Digital Menus</span>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 40px; color: #2E3A3A; font-size: 16px; line-height: 1.6;">
                                    <h3 style="margin-top: 0; margin-bottom: 20px; font-weight: 600; font-size: 20px; color: #2E3A3A;">Subscription Activated!</h3>
                                    
                                    <p style="margin: 0 0 20px 0;">Hello <strong>%s</strong>,</p>
                                    
                                    <p style="margin: 0 0 20px 0;">
                                        Your payment has been received, and your MENEX subscription is now fully active. You can now access all premium features.
                                    </p>
                                    
                                    <div style="background-color: #E8F5E9; border-left: 4px solid #6FBF73; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                                        <p style="margin: 0; font-size: 14px; color: #1B5E20;">
                                            <strong>Plan:</strong> %s Plan <br>
                                            <strong>Valid Until:</strong> %s
                                        </p>
                                    </div>

                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%">
                                        <tr>
                                            <td align="center">
                                                <a href="%s/owner-dashboard" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #6FBF73; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 16px; mso-padding-alt: 0;">
                                                    <span style="mso-text-raise: 15pt;">Go to Dashboard</span>
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 0 40px 30px 40px; text-align: center; color: #5F6F6F; font-size: 13px;">
                                    <p style="margin: 0;">&copy; 2026 MENEX Digital Menus. All rights reserved.</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    """.formatted(name, planType, expiryDate, frontendUrl);
    }

    private String buildRenewalEmail(String name, String expiryDate) {
        return """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }
            body { font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F6F8F7; width: 100%%;">
        <center>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #F6F8F7;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            
                            <tr>
                                <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #E0E5E3;">
                                    <h2 style="margin: 0; font-family: 'Inter', sans-serif; color: #6FBF73; font-weight: 700; font-size: 24px; letter-spacing: -0.5px;">
                                        MENEX
                                    </h2>
                                    <span style="font-size: 12px; color: #5F6F6F; text-transform: uppercase; letter-spacing: 2px;">Digital Menus</span>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 40px; color: #2E3A3A; font-size: 16px; line-height: 1.6;">
                                    
                                    <h3 style="margin-top: 0; margin-bottom: 20px; font-weight: 600; font-size: 22px; color: #2E3A3A;">
                                        Renewal Confirmed 
                                    </h3>
                                    
                                    <p style="margin: 0 0 20px 0;">Hi <strong>%s</strong>,</p>
                                    
                                    <p style="margin: 0 0 20px 0;">
                                        You're all set! Thanks for sticking with us. We've successfully renewed your subscription, so your digital menus will stay online without a hitch.
                                    </p>
                                    
                                    <div style="background-color: #E8F5E9; border-left: 4px solid #6FBF73; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                                        <p style="margin: 0; font-size: 14px; color: #1B5E20;">
                                            <strong>New Expiry Date:</strong> <br>
                                            <span style="font-size: 16px; font-weight: 600;">%s</span>
                                        </p>
                                    </div>

                                    <p style="margin: 0 0 30px 0; font-size: 15px; color: #5F6F6F;">
                                        Have a question about your plan? Let us know!
                                    </p>

                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%">
                                        <tr>
                                            <td align="center">
                                                <a href="%s/contact-us" style="display: inline-block; padding: 14px 32px; background-color: #6FBF73; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; mso-padding-alt: 0; box-shadow: 0 4px 6px rgba(111, 191, 115, 0.3);">
                                                    <span style="mso-text-raise: 15pt;">Contact Support</span>
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 0 40px 30px 40px; text-align: center; color: #9E9E9E; font-size: 13px;">
                                    <p style="margin: 0;">&copy; 2026 MENEX Digital Menus. All rights reserved.</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    """.formatted(name, expiryDate, frontendUrl);
    }

    private String buildCancellationEmail(String name, String cancellationDate) {
        return """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }
            body { font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F6F8F7; width: 100%%;">
        <center>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #F6F8F7;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            
                            <tr>
                                <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #E0E5E3;">
                                    <h2 style="margin: 0; font-family: 'Inter', sans-serif; color: #6FBF73; font-weight: 700; font-size: 24px; letter-spacing: -0.5px;">
                                        MENEX
                                    </h2>
                                    <span style="font-size: 12px; color: #5F6F6F; text-transform: uppercase; letter-spacing: 2px;">Digital Menus</span>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 40px; color: #2E3A3A; font-size: 16px; line-height: 1.6;">
                                    <h3 style="margin-top: 0; margin-bottom: 20px; font-weight: 600; font-size: 20px; color: #546E7A;">Subscription Cancelled</h3>
                                    
                                    <p style="margin: 0 0 20px 0;">Hello <strong>%s</strong>,</p>
                                    
                                    <p style="margin: 0 0 20px 0;">
                                        We're sorry to see you go. As requested, your subscription has been cancelled and your access to premium features has been <strong>revoked immediately</strong>.
                                    </p>
                                    
                                    <div style="background-color: #ECEFF1; border-left: 4px solid #78909C; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                                        <p style="margin: 0; font-size: 14px; color: #37474F;">
                                            <strong>Status:</strong> Inactive<br>
                                            <strong>Cancellation Date:</strong> %s
                                        </p>
                                    </div>

                                    <p style="margin: 0 0 30px 0;">
                                        Your digital menus are now offline. You can reactivate your plan at any time to instantly restore access.
                                    </p>

                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%">
                                        <tr>
                                            <td align="center">
                                                <a href="%s/subscription" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #6FBF73; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 16px; mso-padding-alt: 0;">
                                                    <span style="mso-text-raise: 15pt;">Reactivate Subscription</span>
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 0 40px 30px 40px; text-align: center; color: #5F6F6F; font-size: 13px;">
                                    <p style="margin: 0;">&copy; 2026 MENEX Digital Menus. All rights reserved.</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    """.formatted(name, cancellationDate, frontendUrl);
    }

    private String buildExpiredEmail(String name, String expiryDate) {
        return """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }
            body { font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F6F8F7; width: 100%%;">
        <center>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #F6F8F7;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            
                            <tr>
                                <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #E0E5E3;">
                                    <h2 style="margin: 0; font-family: 'Inter', sans-serif; color: #6FBF73; font-weight: 700; font-size: 24px; letter-spacing: -0.5px;">
                                        MENEX
                                    </h2>
                                    <span style="font-size: 12px; color: #5F6F6F; text-transform: uppercase; letter-spacing: 2px;">Digital Menus</span>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 40px; color: #2E3A3A; font-size: 16px; line-height: 1.6;">
                                    <h3 style="margin-top: 0; margin-bottom: 20px; font-weight: 600; font-size: 20px; color: #D32F2F;">Subscription Expired</h3>
                                    
                                    <p style="margin: 0 0 20px 0;">Hello <strong>%s</strong>,</p>
                                    
                                    <p style="margin: 0 0 20px 0;">
                                        Your MENEX subscription has expired. As a result, your premium features have been deactivated and your account has been downgraded.
                                    </p>
                                    
                                    <div style="background-color: #FFEBEE; border-left: 4px solid #D32F2F; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                                        <p style="margin: 0; font-size: 14px; color: #B71C1C;">
                                            <strong>Expired On:</strong> %s <br>
                                            <strong>Status:</strong> Service Suspended
                                        </p>
                                    </div>

                                    <p style="margin: 0 0 30px 0;">
                                        Don't worry, your data is safe. Renew now to instantly restore full access to your digital menus.
                                    </p>

                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%">
                                        <tr>
                                            <td align="center">
                                                <a href="%s/subscription" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #D32F2F; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 16px; mso-padding-alt: 0;">
                                                    <span style="mso-text-raise: 15pt;">Restore Access</span>
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 0 40px 30px 40px; text-align: center; color: #5F6F6F; font-size: 13px;">
                                    <p style="margin: 0;">&copy; 2026 MENEX Digital Menus. All rights reserved.</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    """.formatted(name, expiryDate, frontendUrl);
    }
}
