const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class CertificateService {
    constructor() {
        this.templatePath = path.join(__dirname, '../templates/certificate.html');
        this.pdfDir = path.join(__dirname, '../../certificates/pdf');
        this.jpgDir = path.join(__dirname, '../../certificates/jpg');
        
        // Ensure directories exist
        this.ensureDirectories();
    }
    
    async ensureDirectories() {
        try {
            await fs.mkdir(this.pdfDir, { recursive: true });
            await fs.mkdir(this.jpgDir, { recursive: true });
        } catch (error) {
            console.error('Error creating directories:', error);
        }
    }
    
    async generateCertificate(certificateData) {
        const { name, email, gstNumber, businessName, businessAddress } = certificateData;
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `certificate_${name.replace(/\s+/g, '_').toLowerCase()}_${timestamp}`;
        
        try {
            // Read template
            const template = await fs.readFile(this.templatePath, 'utf8');
            
            // Replace placeholders
            const populatedTemplate = template
                .replace(/{{name}}/g, name)
                .replace(/{{businessName}}/g, businessName)
                .replace(/{{businessAddress}}/g, businessAddress)
                .replace(/{{gstNumber}}/g, gstNumber)
                .replace(/{{date}}/g, new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }));
            
            // Launch Puppeteer
            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            
            // Set viewport for consistent rendering
            await page.setViewport({ width: 1200, height: 900 });
            
            // Set content
            await page.setContent(populatedTemplate, {
                waitUntil: 'networkidle0'
            });
            
            // Generate PDF
            const pdfPath = path.join(this.pdfDir, `${filename}.pdf`);
            await page.pdf({
                path: pdfPath,
                format: 'A4',
                landscape: true,
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                }
            });
            
            // Generate JPG
            const jpgPath = path.join(this.jpgDir, `${filename}.jpg`);
            await page.screenshot({
                path: jpgPath,
                type: 'jpeg',
                quality: 90,
                fullPage: true
            });
            
            await browser.close();
            
            return {
                success: true,
                pdfPath,
                jpgPath,
                filename
            };
            
        } catch (error) {
            console.error('Certificate generation error:', error);
            throw new Error(`Failed to generate certificate: ${error.message}`);
        }
    }
}

module.exports = new CertificateService();
