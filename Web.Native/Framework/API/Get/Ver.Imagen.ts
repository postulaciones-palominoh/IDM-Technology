import { request } from '@playwright/test';
import { CREDENTIALS } from '../../../Config/Resource/Resource'; // Ajusta la ruta según tu proyecto
import * as fs from 'fs';
import * as path from 'path';

export default class FetchImage {
  private Elements = {
    Link_API: 'http://localhost:5002', // URL base del API
    Username: CREDENTIALS.USERNAME_PORTAL,
    Password: CREDENTIALS.PASSWORD_PORTAL,
  };

  /**
   * Descarga la imagen desde el API y devuelve su contenido como Base64.
   * @param imageName Nombre de la imagen (e.g., firma.jpg)
   * @returns El contenido de la imagen como una URL base64.
   */
  async fetchImage(imageName: string): Promise<string | void> {
    const apiContext = await request.newContext({
      baseURL: this.Elements.Link_API,
      extraHTTPHeaders: {
        Authorization:
          'Basic ' + Buffer.from(`${this.Elements.Username}:${this.Elements.Password}`).toString('base64'),
      },
    });

    try {
      const url = `/api/download?name=${encodeURIComponent(imageName)}`;
      console.log('Consultando URL:', url);

      const response = await apiContext.get(url);

      if (response.ok()) {
        const buffer = await response.body();
        const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        console.log(`✔ Imagen descargada y convertida a Base64.`);
        return base64Image;
      } else {
        console.error(`Error al obtener la imagen. Código de estado: ${response.status()}`);
        return;
      }
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      return;
    } finally {
      await apiContext.dispose();
    }
  }

  /**
   * Muestra la imagen descargada en el navegador.
   * @param base64Image Contenido de la imagen en formato Base64.
   * @param imageName Nombre de la imagen (para referencia en el navegador).
   */
  async displayImage(base64Image: string, imageName: string): Promise<void> {
    const htmlContent = `
      <html>
        <body>
          <h1>Vista Previa de la Imagen</h1>
          <img src="${base64Image}" alt="${imageName}" style="max-width: 100%; height: auto;" />
        </body>
      </html>
    `;

    const tempFilePath = path.join(__dirname, `${imageName.replace(/\.[^/.]+$/, '')}_preview.html`);
    fs.writeFileSync(tempFilePath, htmlContent);

    console.log(`Archivo HTML creado: ${tempFilePath}`);

    const open = require('open');
    await open(tempFilePath);
  }

  /**
   * Guarda la imagen descargada como un archivo físico.
   * @param base64Image Contenido de la imagen en formato Base64.
   * @param outputFileName Nombre del archivo de salida (sin extensión).
   */
  async saveImage(base64Image: string, outputFileName: string): Promise<void> {
    const matches = base64Image.match(/^data:image\/(jpeg|png);base64,(.+)$/);
    if (!matches) {
      console.error('Formato Base64 inválido');
      return;
    }

    const extension = matches[1];
    const data = matches[2];

    const outputPath = path.join(__dirname, `${outputFileName}.${extension}`);
    fs.writeFileSync(outputPath, Buffer.from(data, 'base64'));

    console.log(`Imagen guardada en: ${outputPath}`);
  }
}
