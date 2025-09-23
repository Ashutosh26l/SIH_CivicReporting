import multer from 'multer';

// Use memory storage to send file buffer to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { files: 10 }, // max 10 files
});

export default upload;
