function validateCertificateData(data) {
    const errors = [];
    const requiredFields = ['name', 'email', 'gstNumber', 'businessName', 'businessAddress'];
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field} is required`);
        }
    });
    
    // Validate email format
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Invalid email format');
    }
    
    // Validate GST number format (basic validation)
    if (data.gstNumber && !isValidGSTNumber(data.gstNumber)) {
        errors.push('Invalid GST number format');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidGSTNumber(gst) {
    // Basic GST validation (15 characters, alphanumeric)
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
}

module.exports = {
    validateCertificateData,
    isValidEmail,
    isValidGSTNumber
};
