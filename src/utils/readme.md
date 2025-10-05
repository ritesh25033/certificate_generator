
```markdown
# 🎓 Certificate Generation and Email Delivery System

A Node.js application that dynamically generates professional certificates with backend data and delivers them via email in both PDF and JPG formats.

## ✨ Features

- **Dynamic Certificate Generation** - Generate certificates with custom data
- **Dual Format Output** - Both PDF and JPG formats
- **Professional Templates** - Beautiful HTML/CSS certificate design
- **Email Delivery** - Automated email sending with attachments
- **Input Validation** - Comprehensive data validation
- **RESTful API** - Clean API endpoints for integration
- **Development Mode** - Skip email for local testing
- **Error Handling** - Robust error handling and logging

## 📋 Requirements

- **Node.js** 18+ 
- **npm** 6+
- **Puppeteer** (for PDF/JPG generation)
- **Gmail Account** (for email delivery)
- **2-Step Verification** enabled on Gmail

## 🚀 Quick Start

### 1. Clone and Install

```
# Clone the repository
git clone <repository-url>
cd certificate-generator

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Development Mode (Skip email)
SKIP_EMAIL=true

# Gmail Configuration (Required for production)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Certificate Authority
```

### 3. Gmail Setup (For Production)

1. **Enable 2-Step Verification:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Visit [App Passwords](https://myaccount.google.com/apppasswords)
   - Select **Mail** → **Other (custom name)**
   - Copy the 16-character password
   - Update `EMAIL_PASS` in `.env` file

### 4. Run the Application

```
# Development mode
npm start

# Development with auto-reload
npm run dev
```

The server will start at `http://localhost:3000`

## 📁 Project Structure

```
certificate-generator/
├── src/
│   ├── controllers/
│   │   └── certificateController.js    # API endpoint handlers
│   ├── services/
│   │   ├── certificateService.js       # Certificate generation logic
│   │   └── emailService.js             # Email delivery service
│   ├── templates/
│   │   └── certificate.html            # Certificate template
│   ├── utils/
│   │   └── helpers.js                  # Validation utilities
│   └── app.js                          # Express application
├── certificates/
│   ├── pdf/                            # Generated PDF certificates
│   └── jpg/                            # Generated JPG certificates
├── .env                                # Environment variables
├── .gitignore                          # Git ignore rules
├── package.json                        # Dependencies and scripts
├── server.js                           # Application entry point
└── README.md                           # This file
```

## 🔌 API Endpoints

### 1. Health Check
```
GET /api/health
```

**Response:**
```
{
  "status": "OK",
  "timestamp": "2025-10-05T08:30:00.000Z",
  "service": "Certificate Generator API"
}
```

### 2. Generate Certificate Only
```
POST /api/certificate/generate
```

**Request Body:**
```
{
  "name": "John Doe",
  "email": "john@example.com",
  "gstNumber": "29ABCDE1234F1Z5",
  "businessName": "Doe Enterprises Ltd",
  "businessAddress": "123 Business Street, Tech City, State 560001"
}
```

**Response:**
```
{
  "success": true,
  "message": "Certificate generated successfully",
  "data": {
    "filename": "certificate_john_doe_1728090000000",
    "pdfPath": "/path/to/certificate.pdf",
    "jpgPath": "/path/to/certificate.jpg"
  }
}
```

### 3. Generate and Send Certificate
```
POST /api/certificate/generate-and-send
```

**Request Body:** Same as above

**Response:**
```
{
  "success": true,
  "message": "Certificate generated and sent successfully",
  "data": {
    "filename": "certificate_john_doe_1728090000000",
    "emailSent": true,
    "messageId": "message-id-from-email-service"
  }
}
```

### 4. Send Email for Existing Certificate
```
POST /api/certificate/send-email
```

**Request Body:**
```
{
  "name": "John Doe",
  "email": "john@example.com",
  "filename": "certificate_john_doe_1728090000000"
}
```

## 🧪 Testing

### Quick Test Commands

```
# Test health endpoint
curl http://localhost:3000/api/health

# Generate certificate
curl -X POST http://localhost:3000/api/certificate/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "gstNumber": "29TEST1234F1Z5",
    "businessName": "Test Business",
    "businessAddress": "123 Test Street"
  }'

# Generate and send certificate  
curl -X POST http://localhost:3000/api/certificate/generate-and-send \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "gstNumber": "29TEST1234F1Z5",
    "businessName": "Test Business",
    "businessAddress": "123 Test Street"
  }'
```

### Validation Testing

```
# Test missing fields (should return validation error)
curl -X POST http://localhost:3000/api/certificate/generate \
  -H "Content-Type: application/json" \
  -d '{"name": "Incomplete User"}'
```

## 📝 Required Fields

All certificate generation endpoints require:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | String | Full name of certificate recipient | "John Doe" |
| `email` | String | Valid email address | "john@example.com" |
| `gstNumber` | String | Valid GST number (15 chars) | "29ABCDE1234F1Z5" |
| `businessName` | String | Business/Company name | "Doe Enterprises Ltd" |
| `businessAddress` | String | Complete business address | "123 Business St, City 560001" |

## ⚙️ Configuration Options

### Development Mode
```
NODE_ENV=development
SKIP_EMAIL=true
```
- Skips email delivery
- Certificates saved to local folders
- Faster testing and development

### Production Mode  
```
NODE_ENV=production
SKIP_EMAIL=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```
- Enables email delivery
- Requires valid Gmail credentials
- Full certificate delivery workflow

## 🎨 Certificate Customization

### Template Location
- **File:** `src/templates/certificate.html`
- **Styling:** Inline CSS with professional design
- **Variables:** `{{name}}`, `{{businessName}}`, `{{businessAddress}}`, `{{gstNumber}}`, `{{date}}`

### Customization Options
- Modify HTML structure in template file
- Update CSS styling for different designs
- Add new template variables in `certificateService.js`
- Change certificate dimensions and layout

## 🔧 Troubleshooting

### Common Issues

#### 1. Gmail Authentication Error (535)
```
❌ Gmail Standard failed: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solution:**
- Ensure 2-Step Verification is enabled
- Generate new App Password
- Remove spaces from app password in `.env`
- Use full Gmail address as `EMAIL_USER`

#### 2. Certificate Generation Fails
```
❌ Certificate generation failed
```

**Solutions:**
- Check if Puppeteer is installed: `npm install puppeteer`
- Ensure certificates folders exist
- Verify file write permissions
- Check template file exists at `src/templates/certificate.html`

#### 3. Missing Dependencies
```
❌ Module not found
```

**Solution:**
```
npm install express puppeteer nodemailer dotenv cors
```

### Development Tips

1. **Use SKIP_EMAIL=true** for local testing
2. **Check console logs** for detailed error messages
3. **Verify file paths** in certificate folders
4. **Test with Postman** or curl for API testing
5. **Check .env file** for correct environment variables

## 📦 Dependencies

### Core Dependencies
```
{
  "express": "^4.21.2",
  "puppeteer": "^23.9.0", 
  "nodemailer": "^6.9.15",
  "dotenv": "^16.4.5",
  "cors": "^2.8.5"
}
```

### Development Dependencies
```
{
  "nodemon": "^3.1.7"
}
```

## 🚀 Production Deployment

### 1. Environment Setup
- Set `NODE_ENV=production`
- Set `SKIP_EMAIL=false` 
- Configure valid Gmail credentials
- Set proper `PORT` for hosting platform

### 2. Build and Start
```
# Install production dependencies
npm ci --only=production

# Start the application
npm start
```

### 3. Hosting Platforms

#### Heroku
```
# Add environment variables
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set NODE_ENV=production
```

#### Railway/Render
- Add environment variables in platform dashboard
- Ensure proper port configuration
- Set build and start commands

#### AWS/DigitalOcean
- Use PM2 for process management
- Configure reverse proxy (Nginx)
- Set up SSL certificates

## 🔒 Security Best Practices

1. **Environment Variables:** Never commit `.env` to version control
2. **App Passwords:** Use Gmail App Passwords, not regular passwords  
3. **Input Validation:** All inputs are validated before processing
4. **Error Handling:** Sensitive information is not exposed in errors
5. **CORS:** Configure CORS for specific domains in production
6. **Rate Limiting:** Consider adding rate limiting for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email your-email@example.com or create an issue in the repository.

## 🙏 Acknowledgments

- [Puppeteer](https://pptr.dev/) for PDF/image generation
- [Nodemailer](https://nodemailer.com/) for email delivery
- [Express.js](https://expressjs.com/) for web framework
- [Google Gmail API](https://developers.google.com/gmail) for email service

---

## 📊 API Response Examples

### Success Response
```
{
  "success": true,
  "message": "Certificate generated and sent successfully",
  "data": {
    "filename": "certificate_john_doe_1728090000000",
    "pdfPath": "/certificates/pdf/certificate_john_doe_1728090000000.pdf",
    "jpgPath": "/certificates/jpg/certificate_john_doe_1728090000000.jpg", 
    "emailSent": true,
    "messageId": "message-id-12345"
  }
}
```

### Error Response
```
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "email is required",
    "gstNumber is required"
  ]
}
```

### Development Mode Response
```
{
  "success": true,
  "message": "Certificate generated successfully (email delivery failed/skipped)",
  "data": {
    "filename": "certificate_test_user_1728090000000",
    "emailSent": true,
    "messageId": "dev-mode-skipped",
    "note": "Check certificates/ folder for generated files"
  }
}
```

---

**Built with ❤️ using Node.js, Express, Puppeteer, and Nodemailer**
```

## 📋 How to Use This README

1. **Copy the entire content above** (everything between the triple backticks)

2. **Create a new file** in your project root directory:
   ```bash
   # In your certificate-generator folder
   notepad README.md
   # or
   code README.md
   ```

3. **Paste the content** and save the file

4. **Customize if needed**:
   - Replace `<repository-url>` with your actual Git repository URL
   - Update contact email in the Support section
   - Add your name/organization in the License section

5. **Commit to version control**:
   ```bash
   git add README.md
   git commit -m "Add comprehensive README documentation"
   git push
   ```

This README provides complete documentation for your Certificate Generation System and makes it professional and ready to share! 🚀