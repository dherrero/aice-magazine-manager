import { Request, Response, Router } from 'express';
import multer from 'multer';
import * as Tesseract from 'tesseract.js';

const router = Router();

// Configurar Multer para el manejo de archivos
const storage = multer.memoryStorage(); // Almacena la imagen en memoria
const upload = multer({ storage: storage });

// Ruta para subir la imagen y procesarla con Tesseract
router.post(
  '/upload',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'No se ha subido ninguna imagen' });
      }

      // Convertir la imagen cargada en un buffer a texto usando Tesseract
      const { buffer } = req.file;
      const result = await Tesseract.recognize(buffer, 'eng', {
        logger: (m) => console.log(m), // Para ver el progreso de Tesseract
      });

      // Enviar el texto procesado como respuesta
      return res.json({ text: result.data.text });
    } catch (error) {
      console.error('Error procesando la imagen:', error);
      return res.status(500).json({ error: 'Error procesando la imagen' });
    }
  }
);

export default router;
