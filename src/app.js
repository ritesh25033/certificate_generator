// const express = require('express');
// const cors = require('cors');
// const certificateController = require('./controllers/certificateController');

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // Routes
// app.post('/api/certificate/generate-and-send', certificateController.generateAndSendCertificate);
// app.post('/api/certificate/generate', certificateController.generateCertificate);
// app.post('/api/certificate/send-email', certificateController.sendCertificateEmail);

// // Health check
// app.get('/api/health', (req, res) => {
//     res.json({
//         status: 'OK',
//         timestamp: new Date().toISOString(),
//         service: 'Certificate Generator API'
//     });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         error: 'Something went wrong!'
//     });
// });

// // 404 handler
// app.use('/*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         error: 'Route not found'
//     });
// });

// module.exports = app;


const express = require('express');
const cors = require('cors');
const certificateController = require('./controllers/certificateController');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.post('/api/certificate/generate-and-send', certificateController.generateAndSendCertificate);
app.post('/api/certificate/generate', certificateController.generateCertificate);
app.post('/api/certificate/send-email', certificateController.sendCertificateEmail);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Certificate Generator API'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// 404 handler - Fixed wildcard route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
    });
});

module.exports = app;
