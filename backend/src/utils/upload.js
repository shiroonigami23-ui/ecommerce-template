const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const AppError = require('./errorHandler').AppError;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

// Cloudinary storage configuration
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    public_id: (req, file) => {
      const randomName = crypto.randomBytes(16).toString('hex');
      return `product-${Date.now()}-${randomName}`;
    },
  },
});

// Local storage configuration (for development)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${randomName}${ext}`);
  },
});

// Choose storage based on environment
const storage = process.env.NODE_ENV === 'production' ? cloudinaryStorage : diskStorage;

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Helper function to delete file from Cloudinary
const deleteCloudinaryFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
  }
};

// Helper function to delete local file
const deleteLocalFile = (filePath) => {
  const fs = require('fs');
  const path = require('path');
  
  const fullPath = path.join(__dirname, '..', filePath);
  
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting local file:', err);
    }
  });
};

// Middleware to handle multiple image uploads
const uploadProductImages = upload.array('images', 10);

// Middleware to handle single image upload
const uploadUserAvatar = upload.single('avatar');

// Middleware to handle category image upload
const uploadCategoryImage = upload.single('image');

// Helper to format uploaded file response
const formatFileResponse = (file, isCloudinary = process.env.NODE_ENV === 'production') => {
  if (isCloudinary && file.path) {
    return {
      url: file.path,
      publicId: file.filename,
      format: file.format,
      bytes: file.bytes,
      width: file.width,
      height: file.height,
    };
  } else {
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
};

// Create uploads directory if it doesn't exist (for local storage)
if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

module.exports = {
  upload,
  uploadProductImages,
  uploadUserAvatar,
  uploadCategoryImage,
  deleteCloudinaryFile,
  deleteLocalFile,
  formatFileResponse,
  cloudinary,
};
