require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Certificate Generator API running on port ${PORT}`);
    console.log(`📝 API Endpoints:`);
    console.log(`   POST /api/certificate/generate-and-send`);
    console.log(`   POST /api/certificate/generate`);
    console.log(`   POST /api/certificate/send-email`);
    console.log(`   GET  /api/health`);
});
