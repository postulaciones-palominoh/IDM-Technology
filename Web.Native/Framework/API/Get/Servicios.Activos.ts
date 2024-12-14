import { request, type Page } from '@playwright/test';
import { CREDENTIALS } from '../../../Config/Resource/Resource';

export default class ServiceActive {
  constructor(private page: Page) {}

  private Elements = {
    Link_API: 'http://localhost:5002',
    Username: CREDENTIALS.USERNAME_PORTAL,
    Password: CREDENTIALS.PASSWORD_PORTAL,
  };

  // Método para verificar si el servicio está activo
  async verificarServicioActivo(): Promise<boolean> {
    const apiContext = await request.newContext({
      baseURL: this.Elements.Link_API,
      extraHTTPHeaders: {
        Authorization: 'Basic ' + Buffer.from(`${this.Elements.Username}:${this.Elements.Password}`).toString('base64'),
      },
    });

    try {
      // Intentar hacer la solicitud GET
      const response = await apiContext.get('/api/members');
      
      // Manejo del código de estado 429 (Demasiadas solicitudes)
      if (response.status() === 429) {
        const retryAfter = response.headers()['retry-after'];
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        console.log(` \x1b[33m⚠ Demasiadas solicitudes. Esperando ${delay / 1000} segundos...\x1b[0m`);
        await new Promise(resolve => setTimeout(resolve, delay)); // Esperar el tiempo antes de reintentar
        return this.verificarServicioActivo(); // Llamada recursiva para intentar de nuevo
      }

      // Si la respuesta es exitosa, verificamos el estado
      if (response.ok()) {
        console.log('\x1b[33m --------------------------------------------------------------------\x1b[0m');
        console.log(`\x1b[32m✔ El servicio está activo. Código de estado: ${response.status()}\x1b[0m`);
        return true; // El servicio está activo
      } else {
        console.error(`El servicio no está activo. Código de estado: ${response.status()}`);
        return false; // El servicio no está activo
      }
    } catch (error) {
      console.error('Error al verificar el servicio:', error);
      return false; // Error durante la verificación
    } finally {
      await apiContext.dispose(); // Cerramos el contexto de la solicitud
    }
  }
}