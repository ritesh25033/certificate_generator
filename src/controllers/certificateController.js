
const certificateService = require('../services/certificateService');
const emailService = require('../services/emailService');
const { validateCertificateData } = require('../utils/helpers');
const path = require('path'); // Added missing import

class CertificateController {
    async generateAndSendCertificate(req, res) {
        try {
            const certificateData = req.body;
            
            // Validate input data
            const validation = validateCertificateData(certificateData);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: validation.errors
                });
            }
            
            // Generate certificate
            console.log('Generating certificate for:', certificateData.name);
            const certificateResult = await certificateService.generateCertificate(certificateData);
            
            if (!certificateResult.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Certificate generation failed'
                });
            }
            
            // Send email
            console.log('Sending email to:', certificateData.email);
            const emailResult = await emailService.sendCertificate(
                certificateData,
                certificateResult
            );
            
            res.json({
                success: true,
                message: 'Certificate generated and sent successfully',
                data: {
                    filename: certificateResult.filename,
                    emailSent: emailResult.success,
                    messageId: emailResult.messageId
                }
            });
            
        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    
    async generateCertificate(req, res) {
        try {
            const certificateData = req.body;
            
            // Validate input data
            const validation = validateCertificateData(certificateData);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: validation.errors
                });
            }
            
            // Generate certificate
            const result = await certificateService.generateCertificate(certificateData);
            
            res.json({
                success: true,
                message: 'Certificate generated successfully',
                data: {
                    filename: result.filename,
                    pdfPath: result.pdfPath,
                    jpgPath: result.jpgPath
                }
            });
            
        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    
    async sendCertificateEmail(req, res) {
        try {
            const { email, name, filename } = req.body;
            
            const pdfPath = path.join(__dirname, '../../certificates/pdf', `${filename}.pdf`);
            const jpgPath = path.join(__dirname, '../../certificates/jpg', `${filename}.jpg`);
            
            const result = await emailService.sendCertificate(
                { name, email },
                { pdfPath, jpgPath, filename }
            );
            
            res.json({
                success: true,
                message: 'Certificate sent successfully',
                data: result
            });
            
        } catch (error) {
            console.error('Email sending error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new CertificateController();
