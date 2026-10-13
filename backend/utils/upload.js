// utils/upload.js – Multer + Cloudinary storage configuration
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// ── Configure Cloudinary ──────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Cloudinary Storage Engine ─────────────────────────────────────────────────
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'shan-auto',                        // Cloudinary folder
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto:best' }],
        public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    }),
});

// ── File Filter ───────────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const valid = allowed.test(file.mimetype) && allowed.test(file.originalname.toLowerCase());
    if (valid) return cb(null, true);
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};

// ── Multer Instance ───────────────────────────────────────────────────────────
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

// ── Expose raw cloudinary for delete operations ───────────────────────────────
upload.cloudinary = cloudinary;

module.exports = upload;
