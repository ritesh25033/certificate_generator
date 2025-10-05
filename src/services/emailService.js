const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        // Skip email setup if SKIP_EMAIL is true
        if (process.env.SKIP_EMAIL === 'true') {
            console.log('📧 Email service disabled in development mode');
            this.transporter = null;
            return;
        }
        
        this.transporter = null;
        this.initializeTransporter();
    }
    
    async initializeTransporter() {
        // Skip if email is disabled
        if (process.env.SKIP_EMAIL === 'true') {
            return false;
        }
        
        const configurations = [
            {
                name: 'Gmail Standard',
                config: {
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                }
            }
        ];
        
        for (const { name, config } of configurations) {
            try {
                console.log(`🔄 Trying ${name} configuration...`);
                const transporter = nodemailer.createTransport(config);
                
                await transporter.verify();
                
                console.log(`✅ ${name} configuration successful!`);
                this.transporter = transporter;
                return true;
                
            } catch (error) {
                console.log(`❌ ${name} failed:`, error.message);
            }
        }
        
        console.log('🚨 All email configurations failed!');
        return false;
    }
    
    async verifyConnection() {
        if (process.env.SKIP_EMAIL === 'true') {
            console.log('📧 Email verification skipped (development mode)');
            return true;
        }
        
        return await this.initializeTransporter();
    }
    
    async sendCertificate(recipientData, certificatePaths) {
        // Skip email in development
        if (process.env.SKIP_EMAIL === 'true') {
            console.log('📧 Email sending skipped (development mode)');
            console.log(`📂 Certificate files generated:`);
            console.log(`   PDF: ${certificatePaths.pdfPath}`);
            console.log(`   JPG: ${certificatePaths.jpgPath}`);
            
            return {
                success: true,
                messageId: 'dev-mode-skipped',
                response: 'Email skipped in development mode',
                note: 'Check certificates/ folder for generated files'
            };
        }
        
        // Regular email sending logic for production
        const { name, email } = recipientData;
        const { pdfPath, jpgPath, filename } = certificatePaths;
        
        const mailOptions = {
            from: {
                name: process.env.EMAIL_FROM_NAME || 'Certificate Authority',
                address: process.env.EMAIL_FROM || process.env.EMAIL_USER
            },
            to: email,
            subject: `🎉 Your Certificate is Ready - ${name}`,
            html: this.generateEmailTemplate(name),
            attachments: [
                {
                    filename: `${filename}.pdf`,
                    path: pdfPath,
                    contentType: 'application/pdf'
                },
                {
                    filename: `${filename}.jpg`,
                    path: jpgPath,
                    contentType: 'image/jpeg'
                }
            ]
        };
        
        try {
            console.log(`📧 Sending email to ${email}...`);
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully:', result.messageId);
            return {
                success: true,
                messageId: result.messageId,
                response: result.response
            };
        } catch (error) {
            console.error('❌ Email sending error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
    
    generateEmailTemplate(name) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Certificate Ready</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Certificate Ready!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                <h2 style="color: #2c3e50; margin-top: 0;">Dear ${name},</h2>
                
                <p>Congratulations! Your business certificate has been successfully generated and is ready for download.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #667eea;">📄 What's Included:</h3>
                    <ul style="margin-bottom: 0;">
                        <li><strong>PDF Version:</strong> Perfect for printing and official use</li>
                        <li><strong>JPG Version:</strong> Ideal for digital sharing and web use</li>
                    </ul>
                </div>
                
                <p>Both versions are attached to this email. Please save them in a secure location for your records.</p>
            </div>
            
            <div style="text-align: center; padding: 20px; background: #2c3e50; color: white; border-radius: 10px;">
                <p style="margin: 0;">Certificate Authority Team</p>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = new EmailService();
