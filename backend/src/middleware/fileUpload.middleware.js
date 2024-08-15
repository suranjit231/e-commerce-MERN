import multer from "multer";
import path from 'path';
import { fileURLToPath } from "url";

// Ensure the uploads directory exists
const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
import fs from 'fs';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

export const upload = multer({ storage: storageConfig });
