import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data'; // Asegúrate de que 'form-data' se importa correctamente
import { request, Page } from '@playwright/test';
import { CREDENTIALS } from '../../../Config/Resource/Resource'; // Asegúrate de que la ruta esté correcta

export default class UploadImage {
  constructor(private page: Page) {}

  private Elements = {
    Link_API: 'http://localhost:5002',
    Username: CREDENTIALS.USERNAME_PORTAL,
    Password: CREDENTIALS.PASSWORD_PORTAL,
  };

  // Método para cargar la imagen
  async uploadImage(imagePath: string, fileName: string): Promise<boolean> {
    // Resolver la ruta correcta sin duplicación de carpetas
    const basePath = path.join(__dirname, '../../..', 'assets', 'images');  // Base de la carpeta 'assets/images'
    const fullImagePath = path.join(basePath, imagePath);  // Concatenamos la ruta relativa
    console.log('\x1b[33m --------------------------------------------------------------------\x1b[0m');
    console.log('Ruta completa de la imagen:', fullImagePath); // Esto es solo para depuración

    // Verificar si el archivo existe
    if (!fs.existsSync(fullImagePath)) {
      console.error('El archivo no existe en la ruta proporcionada:', fullImagePath);
      return false;
    }

    const apiContext = await request.newContext({
      baseURL: this.Elements.Link_API,
      extraHTTPHeaders: {
        Authorization: 'Basic ' + Buffer.from(`${this.Elements.Username}:${this.Elements.Password}`).toString('base64'),
      },
    });

    try {
      // Crear el formulario de datos con la imagen
      const formData = new FormData();
      formData.append('file', fs.createReadStream(fullImagePath), fileName); // Usar fs.createReadStream correctamente
      formData.append('name', fileName); // El nombre del archivo como texto

      // Hacer la solicitud POST para subir la imagen
      const response = await apiContext.post('/api/upload', {
        data: formData,
      });

      // Manejo del código de estado 429 (Demasiadas solicitudes)
      if (response.status() === 429) {
        const retryAfter = response.headers()['retry-after'];
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        console.log(`\x1b[33m⚠ Demasiadas solicitudes. Esperando ${delay / 1000} segundos...\x1b[0m`);
        await new Promise(resolve => setTimeout(resolve, delay)); // Espera antes de reintentar
        return this.uploadImage(imagePath, fileName); // Llamada recursiva para intentar de nuevo
      }

      // Verificar si la respuesta fue exitosa
      if (response.ok()) {
        const responseData = await response.json();
        console.log('\x1b[33m --------------------------------------------------------------------\x1b[0m');
        console.log(`\x1b[32m✔ Imagen subida correctamente: ${responseData.message}\x1b[0m`);
        return true; // Imagen subida con éxito
      } else {
        console.error(`Error al subir la imagen. Código de estado: ${response.status()}`);
        return false; // No se pudo subir la imagen
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return false; // Error durante la carga de la imagen
    } finally {
      await apiContext.dispose(); // Cerramos el contexto de la solicitud
    }
  }
}