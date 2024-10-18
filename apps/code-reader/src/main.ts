import cors from 'cors';
import express, { Application } from 'express';
import imageRoutes from './routes/image';

const app: Application = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

app.use(cors());

// Ruta para manejar la subida de imágenes y procesamiento con Tesseract
app.use('/api/v1/image', imageRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
