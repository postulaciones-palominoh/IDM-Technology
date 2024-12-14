import { request, type Page } from '@playwright/test';
import { CREDENTIALS } from '../../../Config/Resource/Resource';
import CreateNewMember from '../Post/Create.new.Member';

export default class DeleteMember {
  constructor(private page: Page) {}

  private Elements = {
    Link_API: 'http://localhost:5002',
    Username: CREDENTIALS.USERNAME_PORTAL,
    Password: CREDENTIALS.PASSWORD_PORTAL,
  };

  // Método para eliminar un miembro por su ID
  async eliminarMiembro(): Promise<boolean> {
    const memberId = CreateNewMember.getMemberId();
    if (!memberId) {
      console.error('No se ha encontrado un ID de miembro. Asegúrate de que el miembro haya sido creado primero.');
      return false;  // No se puede eliminar si no existe el ID
    }

    const apiContext = await request.newContext({
      baseURL: this.Elements.Link_API,
      extraHTTPHeaders: {
        Authorization: 'Basic ' + Buffer.from(`${this.Elements.Username}:${this.Elements.Password}`).toString('base64'),
      },
    });

    try {
      // Enviamos una solicitud DELETE para eliminar el miembro
      const response = await apiContext.delete(`/api/members/${memberId}`);

      // Manejamos el código 429 (Demasiadas solicitudes)
      if (response.status() === 429) {
        const retryAfter = response.headers()['retry-after'];
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        console.log(`\x1b[33m⚠ Demasiadas solicitudes\x1b[0m. Esperando ${delay / 1000} segundos antes de intentar de nuevo...`);
        await new Promise(resolve => setTimeout(resolve, delay)); // Espera antes de reintentar
        return this.eliminarMiembro(); // Llamada recursiva para intentar de nuevo
      }

      // Si la respuesta es exitosa, retornamos true (eliminado correctamente)
      if (response.ok()) {
        const responseData = await response.json();
        console.log('\x1b[33m --------------------------------------------------------------------\x1b[0m');
        console.log(`\x1b[32m✔ Miembro con ID\x1b[0m ${memberId} \x1b[32meliminado correctamente.\x1b[0m`);
        console.log(' \x1b[33mRespuesta del API:\x1b[0m', responseData); // Muestra la respuesta completa del API
        return true;
      } else {
        // En caso de error, mostramos el código de estado y la respuesta del error
        const errorData = await response.json();
        console.error(`Error al eliminar el miembro. Código de estado: ${response.status()}`);
        console.error('Detalles del error:', errorData); // Muestra los detalles del error
      }
    } catch (error) {
      console.error('Error al eliminar el miembro:', error);
    } finally {
      await apiContext.dispose();
    }

    return false; // Si no se eliminó correctamente
  }
}