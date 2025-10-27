// middleware/uploadMiddleware.ts
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// 📁 Directorio base donde se guardarán las imágenes
const uploadDir = "uploads";
const imagesDir = path.join(uploadDir, "images");

// 🧩 Asegurarse de que el directorio de destino existe
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// ⚙️ Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, imagesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// 🧱 Filtro para aceptar solo ciertos tipos de archivos
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // 👇 Forzar el tipo correctamente para evitar el error de TS
    cb(new Error("Tipo de archivo no soportado. Solo imágenes JPEG, PNG, GIF o WEBP.") as unknown as null, false);
  }
};

// 🚀 Inicializar Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Máximo 5 MB por archivo
  },
});

export default upload;
